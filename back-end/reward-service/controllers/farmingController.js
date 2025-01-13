// controllers/farmingController.js
const farmingService = require('../service/farmingService');
const logger = require('../utils/logger');

const getAllFarmingData = async (req, res) => {
  try {
    const result = await farmingService.getAllFarmingData();
    logger.info('All farming data retrieved');
    return res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    logger.error(`Error getting all farming data: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Error getting farming data' });
  }
};

const getFarmingDataById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await farmingService.getFarmingDataById(id);
    logger.info(`Farming data with ID ${id} retrieved`);
    return res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    logger.error(`Error getting farming data by ID: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Error getting farming data by ID' });
  }
};

const createFarmingData = async (req, res) => {
  const data = req.body;
  try {
    const userId = req.user.id;
    const result = await farmingService.createFarmingData(data , userId);
    logger.info(`User ${userId} created farming data`);
    return res.status(result.success ? 201 : 500).json(result);
  } catch (error) {
    logger.error(`Error creating farming data: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Error creating farming data' });
  }
};

const updateFarmingData = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const result = await farmingService.updateFarmingData(id, data);
    return res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    logger.error(`Error updating farming data: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Error updating farming data' });
  }
};

const deleteFarmingData = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await farmingService.deleteFarmingData(id);
    logger.info(`Farming data with ID ${id} deleted`);
    return res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    logger.error(`Error deleting farming data: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Error deleting farming data' });
  }
};

module.exports = {
  getAllFarmingData,
  getFarmingDataById,
  createFarmingData,
  updateFarmingData,
  deleteFarmingData,
};
