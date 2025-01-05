// service/rewardService.js
const { PointSettings } = require("../models/PointSettings");
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

// const redeemPoints = async (userId, rewardType) => {
//   // todo : get the points required for each reward type
//   // const pointsRequired = {
//   //   'market_insight': 100,
//   //   'premium_prediction': 100,
//   //   'consultation': 500
//   // };

//   logger.info(`User ${userId} attempting to redeem ${rewardType} reward`);
//   const userPoints = await rewardRepo.getUserPoints(userId);

//   if (!userPoints || userPoints.total_points < pointsRequired[rewardType]) {
//     logger.warn(`User ${userId} has insufficient points for ${rewardType}`);
//     return {
//       success: false,
//       message: "Insufficient points"
//     };
//   }
//   await rewardRepo.deductPoints(userId, pointsRequired[rewardType]);

//   await rewardRepo.addActivityHistory(userId, "Reward Redemption", -pointsRequired[rewardType], `Redeemed ${rewardType} reward`);

//   logger.info(`User ${userId} successfully redeemed ${rewardType} reward`);
//   return {
//     success: true,
//     message: `Redeemed ${rewardType} reward`
//   };
// };

const redeemPoints = async (userId, rewardType) => {
  try {
    logger.info(`User ${userId} attempting to redeem ${rewardType} reward`);

    // Fetch points required for the specific reward type from the database
    const pointSettingsEntry = await PointSettings.findOne({ 
      where: { event: rewardType } 
    });

    // If reward type doesn't exist in point settings
    if (!pointSettingsEntry) {
      logger.warn(`Invalid reward type: ${rewardType}`);
      return {
        success: false,
        message: "Invalid reward type"
      };
    }

    const pointsRequired = pointSettingsEntry.points;

    // Get user's current points
    const userPoints = await rewardRepo.getUserPoints(userId);

    // Check if user has sufficient points
    if (!userPoints || userPoints.total_points < pointsRequired) {
      logger.warn(`User ${userId} has insufficient points for ${rewardType}`);
      return {
        success: false,
        message: "Insufficient points"
      };
    }

    // Deduct points and record activity
    await rewardRepo.deductPoints(userId, pointsRequired);
    await rewardRepo.addActivityHistory(
      userId, 
      "Reward Redemption", 
      -pointsRequired, 
      `Redeemed ${rewardType} reward`
    );

    logger.info(`User ${userId} successfully redeemed ${rewardType} reward`);
    return {
      success: true,
      message: `Redeemed ${rewardType} reward`
    };
  } catch (error) {
    logger.error(`Error in redeemPoints for user ${userId}: ${error.message}`);
    return {
      success: false,
      message: "An error occurred while processing the reward"
    };
  }
};

const addFarmingDataReward = async (userId ) => { 
  const pointSetting = await PointSettings.findOne({ where: { event: 'farming_data' } });
  if (!pointSetting) {
    logger.error('Point setting for farming data not found');
    return { success: false, message: 'Point setting not found' };
  }

  const pointsToAdd = pointSetting.points;
  logger.info(`Adding ${pointsToAdd} points for user ${userId}`);
  return addPoints(userId, pointsToAdd);
}

const addPoints = async (userId, pointsToAdd) => {
  logger.info(`Adding ${pointsToAdd} points for user ${userId}`);
  const userPoints = await rewardRepo.getUserPoints(userId);

  if (!userPoints) {
    logger.info(`User points not found for user ${userId}`);
    await rewardRepo.createUserPoints(userId, pointsToAdd);
    logger.info(`Created new reward points entry for user ${userId} with ${pointsToAdd} points`);
  } else {
    logger.info(`Updating points for user ${userId}. Current total: ${userPoints.total_points}`);
    userPoints.total_points += pointsToAdd;
    await userPoints.save();
    logger.info(`Updated points for user ${userId}. New total: ${pointsToAdd}`);
  }

  // Add activity history
  await rewardRepo.addActivityHistory(userId, "Points Added", pointsToAdd, `Added ${pointsToAdd} points`);

  return {
    success: true,
    message: `Added ${pointsToAdd} points. New total: ${userPoints ? userPoints.total_points : pointsToAdd}`
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
