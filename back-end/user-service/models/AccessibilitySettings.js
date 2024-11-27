// models/AccessibilitySettings.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const AccessibilitySettings = sequelize.define("AccessibilitySettings", {
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "id",
    },
  },
  text_size: DataTypes.STRING,
  layout: DataTypes.STRING,
  color_friendly_scheme: DataTypes.BOOLEAN,
  use_symbols_with_colors: DataTypes.BOOLEAN,
});

module.exports = AccessibilitySettings;
