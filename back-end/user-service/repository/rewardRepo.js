// repository/rewardRepo.js
const RewardPoints = require("../models/RewardPoints");
const RewardActivity = require("../models/RewardActivity");
const logger = require("../utils/logger");

const getUserPoints = async (userId) => {
  logger.info(`Fetching user points for user ${userId}`);
  return await RewardPoints.findOne({ where: { user_id: userId } });
};

const getActivityHistory = async (userId) => {
  logger.info(`Fetching activity history for user ${userId}`);
  return await RewardActivity.findAll({
    where: { user_id: userId },
    order: [["createdAt", "DESC"]],
    limit: 50
  });
};

const deductPoints = async (userId, points) => {
  logger.info(`Deducting ${points} points for user ${userId}`);
  const userPoints = await RewardPoints.findOne({ where: { user_id: userId } });
  if (userPoints) {
    userPoints.total_points -= points;
    await userPoints.save();
    logger.info(`User ${userId} now has ${userPoints.total_points} points`);
  }
};

const createUserPoints = async (userId, points) => {
  logger.info(`Creating new reward points entry for user ${userId}`);
  await RewardPoints.create({
    user_id: userId,
    total_points: points
  });
};

// This function records an activity in the RewardActivity table
const addActivityHistory = async (userId, activityType, pointsEarned, description) => {
  logger.info(`Recording activity for user ${userId}: ${activityType} (${pointsEarned} points)`);
  await RewardActivity.create({
    user_id: userId,
    activity_type: activityType,
    points_earned: pointsEarned,
    description: description
  });
};

module.exports = {
  getUserPoints,
  getActivityHistory,
  deductPoints,
  createUserPoints,
  addActivityHistory
};
