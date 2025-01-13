// models/RewardActivity.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const logger = require("../utils/logger");

const RewardActivity = sequelize.define("RewardActivity", {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  activity_type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  points_earned: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  }
});

RewardActivity.addHook('afterCreate', (rewardActivity, options) => {
  logger.info(`Reward activity recorded for user ${rewardActivity.user_id}: ${rewardActivity.activity_type} (${rewardActivity.points_earned} points)`);
});

module.exports = RewardActivity;
