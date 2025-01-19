const { Op, fn, col } = require('sequelize');
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

// New function to find nearby farmers
const getNearbyFarmers = async (lat, long, radius) => {
    logger.info(`Fetching nearby farmers around (${lat}, ${long}) within ${radius} km`);
    
    // Earth's radius in kilometers
    const earthRadius = 6371;

    // Haversine formula to calculate distance
    const haversineFormula = fn('ST_Distance_Sphere', 
        fn('POINT', col('long'), col('lat')), 
        fn('POINT', long, lat)
    );

    try {
        const nearbyFarmers = await FarmingData.findAll({
            where: fn('ST_Distance_Sphere', 
                fn('POINT', col('long'), col('lat')), 
                fn('POINT', long, lat)
            ) <= (radius * 1000), // Convert km to meters
            attributes: [
                'id', 
                'farmer_ref', 
                'farmer_name', 
                'lat', 
                'long', 
                'vegetable_ref', 
                'vegetable_name', 
                'amount',
                [haversineFormula, 'distance'] // Add distance to the result
            ],
            order: [[haversineFormula, 'ASC']] // Sort by nearest first
        });

        return nearbyFarmers;
    } catch (error) {
        logger.error(`Error finding nearby farmers: ${error.message}`);
        throw error;
    }
};

module.exports = {
    getAllFarmingData,
    getFarmingDataById,
    createFarmingData,
    updateFarmingData,
    deleteFarmingData,
    getNearbyFarmers
};