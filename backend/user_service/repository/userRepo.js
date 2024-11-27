const db = require("../config/db");

// Function to check if the user already exists by email
const findUserByEmail = async (email) => {
  const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0];
};

// Function to insert a new user into the database
const createUser = async (username, email, hashedPassword) => {
  const result = await db.query(
    "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
    [username, email, hashedPassword]
  );
  return result.rows[0];
};

// Function to insert farmer details
const createFarmerDetails = async (userId, age, visionProblems, colorBlindness) => {
  await db.query(
    "INSERT INTO farmer_details (user_id, age, vision_problems, color_blindness) VALUES ($1, $2, $3, $4)",
    [userId, age, visionProblems, colorBlindness]
  );
};

// Function to insert accessibility settings for a user
const createAccessibilitySettings = async (userId, textSize, layout, colorScheme, useSymbols) => {
  await db.query(
    "INSERT INTO accessibility_settings (user_id, text_size, layout, color_friendly_scheme, use_symbols_with_colors) VALUES ($1, $2, $3, $4, $5)",
    [userId, textSize, layout, colorScheme, useSymbols]
  );
};

// Function to fetch user preferences
const getUserPreferences = async (userId) => {
  const result = await db.query(
    "SELECT * FROM accessibility_settings WHERE user_id = $1",
    [userId]
  );
  return result.rows[0];
};

module.exports = {
  findUserByEmail,
  createUser,
  createFarmerDetails,
  createAccessibilitySettings,
  getUserPreferences
};
