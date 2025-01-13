// repository/farmingRepo.js
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

module.exports = {
  getAllFarmingData,
  getFarmingDataById,
  createFarmingData,
  updateFarmingData,
  deleteFarmingData,
};
