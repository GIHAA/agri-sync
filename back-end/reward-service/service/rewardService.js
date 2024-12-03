// service/rewardService.js
const rewardRepo = require("../repository/rewardRepo");
const logger = require("../utils/logger");

const getUserPoints = async (userId) => {
  logger.info(`Fetching points for user ${userId}`);
  const userPoints = await rewardRepo.getUserPoints(userId);
  return userPoints ? userPoints.total_points : 0;
};

const getActivityHistory = async (userId) => {
  logger.info(`Fetching activity history for user ${userId}`);
  return await rewardRepo.getActivityHistory(userId);
};

const redeemPoints = async (userId, rewardType) => {
  const pointsRequired = {
    'market_insight': 100,
    'premium_prediction': 100,
    'consultation': 500
  };

  logger.info(`User ${userId} attempting to redeem ${rewardType} reward`);
  const userPoints = await rewardRepo.getUserPoints(userId);

  if (!userPoints || userPoints.total_points < pointsRequired[rewardType]) {
    logger.warn(`User ${userId} has insufficient points for ${rewardType}`);
    return {
      success: false,
      message: "Insufficient points"
    };
  }
  await rewardRepo.deductPoints(userId, pointsRequired[rewardType]);

  await rewardRepo.addActivityHistory(userId, "Reward Redemption", -pointsRequired[rewardType], `Redeemed ${rewardType} reward`);

  logger.info(`User ${userId} successfully redeemed ${rewardType} reward`);
  return {
    success: true,
    message: `Redeemed ${rewardType} reward`
  };
};

const addFarmingDataReward = async (userId ) => { 
   // todo : get the point for the farming data
  const pointsToAdd = 500;
  logger.info(`Adding ${pointsToAdd} points for user ${userId}`);
  return addPoints(userId, pointsToAdd);
}

const addPoints = async (userId, pointsToAdd) => {
  logger.info(`Adding ${pointsToAdd} points for user ${userId}`);
  const userPoints = await rewardRepo.getUserPoints(userId);

  if (!userPoints) {
    await rewardRepo.createUserPoints(userId, pointsToAdd);
    logger.info(`Created new reward points entry for user ${userId} with ${pointsToAdd} points`);
  } else {
    userPoints.total_points += pointsToAdd;
    await userPoints.save();
    logger.info(`Updated points for user ${userId}. New total: ${pointsToAdd}`);
  }

  // Add activity history
  await rewardRepo.addActivityHistory(userId, "Points Added", pointsToAdd, `Added ${pointsToAdd} points`);

  return {
    success: true,
    message: `Added ${pointsToAdd} points. New total: ${userPoints.total_points}`
  };
};

const updatePoints = async (userId, newPointsTotal) => {
  logger.info(`Updating points for user ${userId} to ${newPointsTotal}`);
  const userPoints = await rewardRepo.getUserPoints(userId);

  if (!userPoints) {
    return { success: false, message: "User points not found" };
  }

  const pointsDifference = newPointsTotal - userPoints.total_points;
  userPoints.total_points = newPointsTotal;
  await userPoints.save();

  // Add activity history
  await rewardRepo.addActivityHistory(userId, "Points Updated", pointsDifference, `Updated points to ${newPointsTotal}`);

  logger.info(`User ${userId} points updated to ${newPointsTotal}`);
  return {
    success: true,
    message: `Points updated to ${newPointsTotal}`
  };
};

module.exports = {
  getUserPoints,
  getActivityHistory,
  redeemPoints,
  addPoints,
  updatePoints,
  addFarmingDataReward
};
