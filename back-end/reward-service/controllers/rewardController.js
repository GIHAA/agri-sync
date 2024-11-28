// controllers/rewardController.js
const rewardService = require("../service/rewardService");
const logger = require("../utils/logger");

const getUserPoints = async (req, res) => {
  try {
    const userId = req.user.id; // From authentication middleware
    logger.info(`Fetching points for user ${userId}`);
    const points = await rewardService.getUserPoints(userId);
    return res.status(200).json({
      success: true,
      data: { points },
      message: "Points retrieved successfully"
    });
  } catch (error) {
    logger.error(`Error fetching points for user ${req.user.id}: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Error retrieving points"
    });
  }
};

const getActivityHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    logger.info(`Fetching activity history for user ${userId}`);
    const activities = await rewardService.getActivityHistory(userId);
    return res.status(200).json({
      success: true,
      data: { activities },
      message: "Activity history retrieved successfully"
    });
  } catch (error) {
    logger.error(`Error fetching activity history for user ${req.user.id}: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Error retrieving activity history"
    });
  }
};

const redeemPoints = async (req, res) => {
  try {
    const userId = req.user.id;
    const { rewardType } = req.body;
    logger.info(`User ${userId} attempting to redeem ${rewardType} reward`);
    const result = await rewardService.redeemPoints(userId, rewardType);

    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    logger.error(`Error redeeming points for user ${req.user.id}: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Error redeeming points"
    });
  }
};

const addPoints = async (req, res) => {
  try {
    const userId = req.user.id;
    const { pointsToAdd } = req.body;
    logger.info(`User ${userId} adding ${pointsToAdd} points`);
    const result = await rewardService.addPoints(userId, pointsToAdd);

    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    logger.error(`Error adding points for user ${req.user.id}: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Error adding points"
    });
  }
};

const updatePoints = async (req, res) => {
  try {
    const userId = req.user.id;
    const { newPointsTotal } = req.body;
    logger.info(`User ${userId} updating points to ${newPointsTotal}`);
    const result = await rewardService.updatePoints(userId, newPointsTotal);

    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    logger.error(`Error updating points for user ${req.user.id}: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Error updating points"
    });
  }
};

module.exports = {
  getUserPoints,
  getActivityHistory,
  redeemPoints,
  addPoints,
  updatePoints
};
