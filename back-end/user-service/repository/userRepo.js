// repository/userRepo.js
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const FarmerDetails = require("../models/FarmerDetails");
const AccessibilitySettings = require("../models/AccessibilitySettings");

// Function to find a user by email
const findUserByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

// Function to create a new user
const createUser = async (username, email, hashedPassword , role) => {
  return await User.create({ username, email, password_hash: hashedPassword , role });
};

// Function to create farmer details
const createFarmerDetails = async (userId, age, visionProblems, colorBlindness , lat , long) => {
  return await FarmerDetails.create({ user_id: userId, age, vision_problems: visionProblems, color_blindness: colorBlindness , lat , long });
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

// Function to get user preferences
const getUserPreferences = async (userId) => {
  return await AccessibilitySettings.findOne({ where: { user_id: userId } });
};

// find all users
// userRepo.js
const findAllUsers = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  
  const { count, rows } = await User.findAndCountAll({
    attributes: ['id', 'username', 'email', 'role'],
    limit: limit,
    offset: offset,
    order: [['createdAt', 'DESC']] // Optional: sort by creation date
  });

  return {
    users: rows,
    totalUsers: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page
  };
};

// Find user by ID with associated data if FARMER
const findUserById = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: ['id', 'username', 'email', 'role']
  });

  if (user && user.role === 'FARMER') {
    const farmerDetails = await FarmerDetails.findOne({
      where: { user_id: userId }
    });
    const accessibilitySettings = await AccessibilitySettings.findOne({
      where: { user_id: userId }
    });
    
    return {
      ...user.toJSON(),
      farmerDetails,
      accessibilitySettings
    };
  }

  return user;
};

// Update user and related details if FARMER
const updateUser = async (userId, updateData) => {
  const user = await User.findByPk(userId);
  if (!user) return null;

  const {
    username,
    email,
    age,
    vision_problems,
    color_blindness,
    text_size,
    layout,
    color_friendly_scheme,
    use_symbols_with_colors
  } = updateData;

  // Update basic user info
  if (username || email) {
    await user.update({
      username: username || user.username,
      email: email || user.email
    });
  }

  // If user is a farmer, update farmer-specific details
  if (user.role === 'FARMER') {
    if (age || vision_problems !== undefined || color_blindness !== undefined) {
      await FarmerDetails.update(
        {
          age: age || undefined,
          vision_problems: vision_problems !== undefined ? vision_problems : undefined,
          color_blindness: color_blindness !== undefined ? color_blindness : undefined
        },
        { where: { user_id: userId } }
      );
    }

    if (text_size || layout || color_friendly_scheme || use_symbols_with_colors !== undefined) {
      await AccessibilitySettings.update(
        {
          text_size: text_size || undefined,
          layout: layout || undefined,
          color_friendly_scheme: color_friendly_scheme || undefined,
          use_symbols_with_colors: use_symbols_with_colors !== undefined ? use_symbols_with_colors : undefined
        },
        { where: { user_id: userId } }
      );
    }
  }

  // Return updated user with all related data
  return await findUserById(userId);
};

// Add to exports
module.exports = {
  findUserByEmail,
  createUser,
  createFarmerDetails,
  createAccessibilitySettings,
  getUserPreferences,
  findAllUsers,
  findUserById,
  updateUser
};