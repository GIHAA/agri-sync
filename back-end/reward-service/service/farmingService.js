const farmingRepo = require('../repository/farmingRepo');
const rewardService = require("../service/rewardService");
const logger = require('../utils/logger');

const getAllFarmingData = async () => {
    try {
        const data = await farmingRepo.getAllFarmingData();
        logger.info('Fetched all farming data successfully.');
        return {
            success: true,
            data,
            message: 'Fetched all farming data successfully.',
        };
    } catch (error) {
        logger.error(`Error fetching all farming data: ${error.message}`);
        return { success: false, message: 'Error fetching farming data' };
    }
};

const getFarmingDataById = async (id) => {
    try {
        const data = await farmingRepo.getFarmingDataById(id);
        if (!data) {
            logger.warn(`Farming data not found for ID: ${id}`);
            return { success: false, message: 'Farming data not found' };
        }
        logger.info(`Fetched farming data for ID: ${id}`);
        return { success: true, data, message: 'Farming data fetched successfully' };
    } catch (error) {
        logger.error(`Error fetching farming data by ID: ${id} - ${error.message}`);
        return { success: false, message: 'Error fetching farming data by ID' };
    }
};

const createFarmingData = async (data, userId) => {
    try {
        logger.info(`Creating farming data for ${data.farmer_name}`);
        const newData = await farmingRepo.createFarmingData(data);
        logger.info(`Created reward for ${data.farmer_name}`);
        const reward = await rewardService.addFarmingDataReward(userId);
        return { 
            success: true, 
            data: { data: newData, reward }, 
            message: 'Farming data created successfully' 
        };
    } catch (error) {
        logger.error(`Error creating farming data: ${error.message}`);
        return { success: false, message: 'Error creating farming data' };
    }
};

const updateFarmingData = async (id, data) => {
    try {
        const updatedData = await farmingRepo.updateFarmingData(id, data);
        if (!updatedData) {
            logger.warn(`Farming data not found for ID: ${id}`);
            return { success: false, message: 'Farming data not found' };
        }
        logger.info(`Updated farming data for ID: ${id}`);
        return { success: true, data: updatedData, message: 'Farming data updated successfully' };
    } catch (error) {
        logger.error(`Error updating farming data: ${error.message}`);
        return { success: false, message: 'Error updating farming data' };
    }
};

const deleteFarmingData = async (id) => {
    try {
        const result = await farmingRepo.deleteFarmingData(id);
        if (!result) {
            logger.warn(`Farming data not found for ID: ${id}`);
            return { success: false, message: 'Farming data not found' };
        }
        logger.info(`Deleted farming data for ID: ${id}`);
        return { success: true, message: 'Farming data deleted successfully' };
    } catch (error) {
        logger.error(`Error deleting farming data: ${error.message}`);
        return { success: false, message: 'Error deleting farming data' };
    }
};

// New method to get nearby farmers
const getNearbyFarmers = async (lat, long, radius) => {
    try {
        // Validate input parameters
        if (!lat || !long || !radius) {
            logger.warn('Invalid parameters for nearby farmers search');
            return { 
                success: false, 
                message: 'Latitude, Longitude, and Radius are required' 
            };
        }

        // Validate radius
        const parsedRadius = Number(radius);
        if (isNaN(parsedRadius) || parsedRadius <= 0) {
            logger.warn('Invalid radius provided');
            return { 
                success: false, 
                message: 'Radius must be a positive number' 
            };
        }

        const nearbyFarmers = await farmingRepo.getNearbyFarmers(
            Number(lat), 
            Number(long), 
            parsedRadius
        );

        logger.info(`Found ${nearbyFarmers.length} nearby farmers`);
        return {
            success: true,
            data: nearbyFarmers,
            message: 'Nearby farmers fetched successfully'
        };
    } catch (error) {
        logger.error(`Error finding nearby farmers: ${error.message}`);
        return { 
            success: false, 
            message: 'Error finding nearby farmers' 
        };
    }
};

const getLeaderboard = async (timeframe, limit) => {
    try {
      // Validate timeframe
      const validTimeframes = ['daily', 'weekly', 'monthly', 'all'];
      const validatedTimeframe = timeframe?.toLowerCase() || 'all';
      
      if (!validTimeframes.includes(validatedTimeframe)) {
        logger.warn(`Invalid timeframe provided: ${timeframe}`);
        return {
          success: false,
          message: 'Invalid timeframe. Must be one of: daily, weekly, monthly, all'
        };
      }
  
      // Validate limit
      const validatedLimit = Math.min(Math.max(parseInt(limit) || 10, 1), 100);
      
      const leaderboardData = await farmingRepo.getLeaderboard(
        validatedTimeframe, 
        validatedLimit
      );
  
      return {
        success: true,
        data: leaderboardData,
        message: 'Leaderboard fetched successfully',
        metadata: {
          timeframe: validatedTimeframe,
          limit: validatedLimit,
          totalParticipants: leaderboardData.length
        }
      };
    } catch (error) {
      logger.error(`Error fetching leaderboard: ${error.message}`);
      return {
        success: false,
        message: 'Error fetching leaderboard'
      };
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