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
    const newUser = await userRepo.createUser(username, email, hashedPassword);

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
    console.log(user);

    const famer = await FarmerDetails.findOne({ where: { user_id: user.id } });

    console.log(famer);

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return { success: false, statusCode: 400, message: "Invalid password" };
    }

    const token = generateToken({ id: user.id, email: user.email, username: user.username, age: famer?.age ? famer?.age : 0, visionProblems: famer?.vision_problems ? famer?.vision_problems : false, colorBlindness: famer?.color_blindness ? famer?.color_blindness : false });

    return {
      success: true,
      data: { token },
      message: "Login successful",
    };
  } catch (error) {
    console.error("Error in login service:", error);
    return { success: false, statusCode: 500, message: "Server error" };
  }
};

// Register farmer with preferences
const registerFarmer = async (username, email, password, age, visionProblems, colorBlindness, textSize, layout, colorScheme, useSymbols) => {
  try {
    const existingUser = await userRepo.findUserByEmail(email);
    if (existingUser) {
      return { success: false, statusCode: 400, message: "User already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userRepo.createUser(username, email, hashedPassword);
    const userId = newUser.id;

    await userRepo.createFarmerDetails(userId, age, visionProblems, colorBlindness);
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


module.exports = {
  registerUser,
  loginUser,
  registerFarmer,
  getUserPreferences,
  getFarmerDetails,
};
