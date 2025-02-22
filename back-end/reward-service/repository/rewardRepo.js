// repository/rewardRepo.js
const RewardPoints = require("../models/RewardPoints");
const RewardActivity = require("../models/RewardActivity");
const { Op, fn, col, Sequelize } = require("sequelize");
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

const addActivityHistory = async (userId, activityType, pointsEarned, description) => {
  logger.info(`Recording activity for user ${userId}: ${activityType} (${pointsEarned} points)`);
  await RewardActivity.create({
    user_id: userId,
    activity_type: activityType,
    points_earned: pointsEarned,
    description: description
  });
};

const getActivityTrend = async (timeframe) => {
  try {
    let timeCondition = {};
    const now = new Date();
    
    if (timeframe === "daily") {
      timeCondition = { createdAt: { [Op.gte]: new Date(now.setHours(0, 0, 0, 0)) } };
    } else if (timeframe === "weekly") {
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      timeCondition = { createdAt: { [Op.gte]: weekAgo } };
    } else if (timeframe === "monthly") {
      const monthAgo = new Date(now);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      timeCondition = { createdAt: { [Op.gte]: monthAgo } };
    }

    const trendData = await RewardActivity.findAll({
      attributes: [
        [fn("DATE", col("createdAt")), "date"],
        [fn("SUM", Sequelize.literal("CASE WHEN points_earned > 0 THEN points_earned ELSE 0 END")), "points_earned"],
        [fn("SUM", Sequelize.literal("CASE WHEN points_earned < 0 THEN points_earned ELSE 0 END")), "points_redeemed"]
      ],
      where: timeCondition,
      group: [fn("DATE", col("createdAt"))],
      order: [[fn("DATE", col("createdAt")), "ASC"]]
    });

    return { success: true, data: trendData, message: "Activity trend fetched successfully" };
  } catch (error) {
    logger.error(`Error fetching activity trend: ${error.message}`);
    return { success: false, message: "Error fetching activity trend" };
  }
};

const getRedemptionAnalytics = async () => {
  try {
    const redemptionData = await RewardActivity.findAll({
      attributes: [
        ["activity_type", "reward_type"],
        [fn("COUNT", col("activity_type")), "redemptions"]
      ],
      // where: { activity_type: "Reward Redemption" },
      group: ["activity_type"],
      order: [[fn("COUNT", col("activity_type")), "DESC"]]
    });

    return { success: true, data: redemptionData, message: "Reward redemption analytics fetched successfully" };
  } catch (error) {
    logger.error(`Error fetching redemption analytics: ${error.message}`);
    return { success: false, message: "Error fetching redemption analytics" };
  }
};

module.exports = {
  getUserPoints,
  getActivityHistory,
  deductPoints,
  createUserPoints,
  addActivityHistory,
  getActivityTrend,
  getRedemptionAnalytics
};
