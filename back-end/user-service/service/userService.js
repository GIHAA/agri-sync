// service/userService.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRepo = require("../repository/userRepo");
const FarmerDetails = require("../models/FarmerDetails");
const farmerRepository = require("../repository/userRepo");

require("dotenv").config();

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET || "defaultsecret", {
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  });
};

// Register user
const registerUser = async (username, email, password) => {
  try {
    const existingUser = await userRepo.findUserByEmail(email);
    if (existingUser) {
      return { success: false, statusCode: 400, message: "User already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userRepo.createUser(username, email, hashedPassword, "ADMIN");

    return {
      success: true,
      data: { id: newUser.id, username, email },
      message: "User created successfully",
    };
  } catch (error) {
    console.error("Error in registration service:", error);
    return { success: false, statusCode: 500, message: "Server error" };
  }
};

// Login user
const loginUser = async (email, password) => {
  try {
    const user = await userRepo.findUserByEmail(email);
    if (!user) {
      return { success: false, statusCode: 404, message: "User not found" };
    }

    const famer = await FarmerDetails.findOne({ where: { user_id: user.id } });


    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return { success: false, statusCode: 400, message: "Invalid password" };
    }

    const token = generateToken({ id: user.id, email: user.email, username: user.username, age: famer?.age ? famer?.age : 0, visionProblems: famer?.vision_problems ? famer?.vision_problems : false, colorBlindness: famer?.color_blindness ? famer?.color_blindness : false });

    delete user.password_hash;

    return {
      success: true,
      data: { token, user, famer },
      message: "Login successful",
    };
  } catch (error) {
    console.error("Error in login service:", error);
    return { success: false, statusCode: 500, message: "Server error" };
  }
};

// Register farmer with preferences
const registerFarmer = async (username, email, password, age, visionProblems, colorBlindness, textSize, layout, colorScheme, useSymbols, lat, long) => {
  try {
    const existingUser = await userRepo.findUserByEmail(email);
    if (existingUser) {
      return { success: false, statusCode: 400, message: "User already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userRepo.createUser(username, email, hashedPassword, "FARMER");
    const userId = newUser.id;

    await userRepo.createFarmerDetails(userId, age, visionProblems, colorBlindness, lat, long);
    await userRepo.createAccessibilitySettings(userId, textSize, layout, colorScheme, useSymbols);

    return {
      success: true,
      data: { id: userId, username, email },
      message: "Farmer registered successfully",
    };
  } catch (error) {
    console.error("Error in farmer registration service:", error);
    return { success: false, statusCode: 500, message: "Server error" };
  }
};

// Get user preferences
const getUserPreferences = async (userId) => {
  try {
    const preferences = await userRepo.getUserPreferences(userId);
    if (!preferences) {
      return { success: false, statusCode: 404, message: "Preferences not found" };
    }

    return { success: true, data: preferences, message: "Preferences fetched successfully" };
  } catch (error) {
    console.error("Error in fetching preferences service:", error);
    return { success: false, statusCode: 500, message: "Server error" };
  }
};

const getFarmerDetails = async (qrCodeHash) => {
  try {
    const farmer = await farmerRepository.getFarmerByQrCode(qrCodeHash);
    if (farmer) {
      return {
        success: true,
        data: farmer,
        message: "Farmer details fetched successfully",
      };
    } else {
      return {
        success: false,
        data: null,
        message: "Farmer not found.",
      };
    }
  } catch (error) {
    console.error("Error in service layer:", error);
    throw new Error("Server error while fetching farmer details.");
  }
};

// userService.js
const getAllUsers = async (page, limit) => {
  try {
    const result = await userRepo.findAllUsers(parseInt(page), parseInt(limit));
    return {
      success: true,
      data: {
        users: result.users,
        meta: {
          totalUsers: result.totalUsers,
          totalPages: result.totalPages,
          currentPage: result.currentPage,
          limit: parseInt(limit)
        }
      },
      message: "Users fetched successfully",
    };
  } catch (error) {
    console.error("Error in fetching users service:", error);
    return { success: false, statusCode: 500, message: "Server error" };
  }
};

// Get one user
const getUser = async (userId) => {
  try {
    const user = await userRepo.findUserById(userId);
    if (!user) {
      return { success: false, statusCode: 404, message: "User not found" };
    }

    return {
      success: true,
      data: user,
      message: "User fetched successfully",
    };
  } catch (error) {
    console.error("Error in fetching user service:", error);
    return { success: false, statusCode: 500, message: "Server error" };
  }
};

// Update user
const updateUser = async (userId, updateData) => {
  try {
    const user = await userRepo.findUserById(userId);
    if (!user) {
      return { success: false, statusCode: 404, message: "User not found" };
    }

    const updatedUser = await userRepo.updateUser(userId, updateData);
    return {
      success: true,
      data: updatedUser,
      message: "User updated successfully",
    };
  } catch (error) {
    console.error("Error in updating user service:", error);
    return { success: false, statusCode: 500, message: "Server error" };
  }
};

// Add to exports
module.exports = {
  registerUser,
  loginUser,
  registerFarmer,
  getUserPreferences,
  getAllUsers,
  getUser,
  updateUser,
  getFarmerDetails,
};