// models/FarmingData.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const logger = require('../utils/logger');

const FarmingData = sequelize.define('FarmingData', {
  farmer_ref: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  farmer_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lat: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  long: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  vegetable_ref: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  vegetable_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  planted_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
});

FarmingData.addHook('afterCreate', (farmingData, options) => {
  logger.info(`New farming data entry created for farmer ${farmingData.farmer_name}: ${farmingData.vegetable_name}, ${farmingData.amount}`);
});

FarmingData.addHook('afterUpdate', (farmingData, options) => {
  logger.info(`Farming data updated for farmer ${farmingData.farmer_name}: ${farmingData.vegetable_name}, ${farmingData.amount}`);
});

module.exports = FarmingData;
