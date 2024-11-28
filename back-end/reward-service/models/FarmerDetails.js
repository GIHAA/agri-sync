// models/FarmerDetails.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const FarmerDetails = sequelize.define("FarmerDetails", {
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "id",
    },
  },
  age: DataTypes.INTEGER,
  vision_problems: DataTypes.BOOLEAN,
  color_blindness: DataTypes.BOOLEAN,
});

module.exports = FarmerDetails;
