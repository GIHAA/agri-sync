// models/RewardPoints.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");
const logger = require("../utils/logger");

const RewardPoints = sequelize.define("RewardPoints", {
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "id"
    }
  },
  total_points: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  last_updated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

RewardPoints.addHook('afterCreate', (rewardPoints, options) => {
  logger.info(`New reward points entry created for user ${rewardPoints.user_id}: ${rewardPoints.total_points} points`);
});

RewardPoints.addHook('afterUpdate', (rewardPoints, options) => {
  logger.info(`Reward points updated for user ${rewardPoints.user_id}: ${rewardPoints.total_points} points`);
});

module.exports = RewardPoints;
