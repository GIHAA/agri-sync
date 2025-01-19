const { Op, fn, col, Sequelize } = require('sequelize');
const sequelize = require('../config/database');
const FarmingData = require('../models/FarmingData');
const logger = require('../utils/logger');

const getAllFarmingData = async () => {
  logger.info('Fetching all farming data');
  return await FarmingData.findAll();
};

const getFarmingDataById = async (id) => {
  logger.info(`Fetching farming data for ID: ${id}`);
  return await FarmingData.findByPk(id);
};

const createFarmingData = async (data) => {
  logger.info(`Creating new farming data entry for ${data.farmer_name}`);
  return await FarmingData.create(data);
};

const updateFarmingData = async (id, data) => {
  logger.info(`Updating farming data for ID: ${id}`);
  const farmingData = await getFarmingDataById(id);
  
  if (!farmingData) {
    logger.warn(`Farming data not found for ID: ${id}`);
    return null;
  }
  
  return await farmingData.update(data);
};

const deleteFarmingData = async (id) => {
  logger.info(`Deleting farming data for ID: ${id}`);
  const farmingData = await getFarmingDataById(id);
  
  if (!farmingData) {
    logger.warn(`Farming data not found for ID: ${id}`);
    return null;
  }
  
  return await farmingData.destroy();
};

const getNearbyFarmers = async (lat, long, radius) => {
  logger.info(`Fetching nearby farmers around (${lat}, ${long}) within ${radius} km`);
  
  try {
    // First, make sure the earthdistance extension is installed
    await sequelize.query('CREATE EXTENSION IF NOT EXISTS cube;');
    await sequelize.query('CREATE EXTENSION IF NOT EXISTS earthdistance;');

    const nearbyFarmers = await FarmingData.findAll({
      where: Sequelize.where(
        fn('earth_distance', 
          fn('ll_to_earth', col('lat'), col('long')),
          fn('ll_to_earth', lat, long)
        ),
        '<=',
        radius * 1000  // Convert km to meters
      ),
      attributes: [
        'id',
        'farmer_ref',
        'farmer_name',
        'lat',
        'long',
        'vegetable_ref',
        'vegetable_name',
        'amount',
        [fn('earth_distance',
          fn('ll_to_earth', col('lat'), col('long')),
          fn('ll_to_earth', lat, long)
        ), 'distance']
      ],
      order: [[fn('earth_distance',
        fn('ll_to_earth', col('lat'), col('long')),
        fn('ll_to_earth', lat, long)
      ), 'ASC']]
    });
    
    return nearbyFarmers;
  } catch (error) {
    logger.error(`Error finding nearby farmers: ${error.message}`);
    throw error;
  }
};

const getLeaderboard = async (timeframe = 'all', limit = 10) => {
    logger.info(`Fetching farmer leaderboard for timeframe: ${timeframe}, limit: ${limit}`);
    
    try {
      let timeCondition = {};
      const now = new Date();
      
      switch(timeframe.toLowerCase()) {
        case 'daily':
          timeCondition = {
            planted_at: {
              [Op.gte]: new Date(now.setHours(0,0,0,0))
            }
          };
          break;
        case 'weekly':
          const weekAgo = new Date(now);
          weekAgo.setDate(weekAgo.getDate() - 7);
          timeCondition = {
            planted_at: {
              [Op.gte]: weekAgo
            }
          };
          break;
        case 'monthly':
          const monthAgo = new Date(now);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          timeCondition = {
            planted_at: {
              [Op.gte]: monthAgo
            }
          };
          break;
      }
  
      const leaderboard = await FarmingData.findAll({
        attributes: [
          'farmer_ref',
          'farmer_name',
          [fn('SUM', col('amount')), 'total_production'],
          [fn('COUNT', col('id')), 'total_entries'],
          [fn('COUNT', Sequelize.fn('DISTINCT', col('vegetable_ref'))), 'unique_vegetables']
        ],
        where: timeCondition,
        group: ['farmer_ref', 'farmer_name'],
        order: [[fn('SUM', col('amount')), 'DESC']],
        limit: limit,
        raw: true
      });
  
      const rankedLeaderboard = leaderboard.map((entry, index) => ({
        ...entry,
        rank: index + 1,
        percentile: Math.round(((limit - index) / limit) * 100)
      }));
  
      return rankedLeaderboard;
    } catch (error) {
      logger.error(`Error generating leaderboard: ${error.message}`);
      throw error;
    }
  };

module.exports = {
  getAllFarmingData,
  getFarmingDataById,
  createFarmingData,
  updateFarmingData,
  deleteFarmingData,
  getNearbyFarmers,
  getLeaderboard
};