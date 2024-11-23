const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
require("dotenv").config();

const router = express.Router();

// Function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET || "defaultsecret", {
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  });
};

// Register User
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into database
    const newUser = await db.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
      [username, email, hashedPassword]
    );

    return res.status(201).json({
      message: "User created successfully",
      user: { id: newUser.rows[0].id, username, email },
    });
  } catch (error) {
    console.error("Error in registration:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate password
    const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate token
    const token = generateToken({
      id: user.rows[0].id,
      email: user.rows[0].email,
    });

    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Register Farmer with Preferences
router.post("/register-farmer", async (req, res) => {
  const {
    username,
    email,
    password,
    age,
    vision_problems = false,
    color_blindness = false,
    text_size = "Medium",
    layout = "Standard",
    color_friendly_scheme = "Standard",
    use_symbols_with_colors = false,
  } = req.body;

  try {
    // Check if user already exists
    const userExists = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    const newUser = await db.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
      [username, email, hashedPassword]
    );

    const userId = newUser.rows[0].id;

    // Insert farmer details
    await db.query(
      "INSERT INTO farmer_details (user_id, age, vision_problems, color_blindness) VALUES ($1, $2, $3, $4)",
      [userId, age, vision_problems, color_blindness]
    );

    // Insert accessibility settings
    await db.query(
      "INSERT INTO accessibility_settings (user_id, text_size, layout, color_friendly_scheme, use_symbols_with_colors) VALUES ($1, $2, $3, $4, $5)",
      [userId, text_size, layout, color_friendly_scheme, use_symbols_with_colors]
    );

    return res.status(201).json({
      message: "Farmer registered successfully",
      user: { id: userId, username, email },
    });
  } catch (error) {
    console.error("Error in farmer registration:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Get User Preferences
router.get("/preferences/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch accessibility settings for the user
    const preferences = await db.query(
      "SELECT * FROM accessibility_settings WHERE user_id = $1",
      [userId]
    );

    if (preferences.rows.length === 0) {
      return res.status(404).json({ message: "Preferences not found for this user" });
    }

    return res.status(200).json({ preferences: preferences.rows[0] });
  } catch (error) {
    console.error("Error fetching preferences:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Token Validation Route
router.get("/validate", async (req, res) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET || "defaultsecret");
    return res.status(200).json({ message: "Token is valid", user });
  } catch (error) {
    console.error("Error in token validation:", error);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
});

module.exports = router;
