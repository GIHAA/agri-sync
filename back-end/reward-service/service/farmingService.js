// service/farmingService.js
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

const createFarmingData = async (data , userId) => {
  try {
    logger.info(`Creating farming data for ${data.farmer_name}`);
    const newData = await farmingRepo.createFarmingData(data);
    logger.info(`Created reward for ${data.farmer_name}`);
    const reward = await rewardService.addFarmingDataReward(userId);
    return { success: true, data: { data : newData , reward }, message: 'Farming data created successfully' };
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

module.exports = {
  getAllFarmingData,
  getFarmingDataById,
  createFarmingData,
  updateFarmingData,
  deleteFarmingData,
};
