// repository/userRepo.js
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const FarmerDetails = require("../models/FarmerDetails");
const AccessibilitySettings = require("../models/AccessibilitySettings");
const db = require("../config/database");

// Function to find a user by email
const findUserByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

// Function to create a new user
const createUser = async (username, email, hashedPassword) => {
  return await User.create({ username, email, password_hash: hashedPassword });
};

// Function to create farmer details
const createFarmerDetails = async (userId, age, visionProblems, colorBlindness) => {
  return await FarmerDetails.create({ user_id: userId, age, vision_problems: visionProblems, color_blindness: colorBlindness });
};

// Function to create accessibility settings
const createAccessibilitySettings = async (userId, textSize, layout, colorScheme, useSymbols) => {
  return await AccessibilitySettings.create({
    user_id: userId,
    text_size: textSize,
    layout,
    color_friendly_scheme: colorScheme,
    use_symbols_with_colors: useSymbols,
  });
};

const getFarmerByQrCode = async (qrCodeHash) => {
  const query = `
    SELECT u.id, u.username, u.email
    FROM users u
    WHERE u.email = :email
  `;

  try {
    const result = await db.query(query, {
      replacements: { email: qrCodeHash }, 
      type: db.QueryTypes.SELECT, 
    });

    return result[0] || null;
  } catch (error) {
    console.error("Error in repository layer:", error.message);
    throw new Error("Database query failed.");
  }
};

// Function to get user preferences
const getUserPreferences = async (userId) => {
  return await AccessibilitySettings.findOne({ where: { user_id: userId } });
};

module.exports = {
  findUserByEmail,
  createUser,
  createFarmerDetails,
  createAccessibilitySettings,
  getUserPreferences,
  getFarmerByQrCode,
};
