const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
require("dotenv").config();
const crypto = require("crypto");

const router = express.Router();

// Function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET || "defaultsecret", {
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  });
};

// Function to generate a unique QR code hash
const generateQrCodeHash = (email) => {
  return crypto.createHash("sha256").update(email).digest("hex");
};


const base64UrlDecode = (str) => {

  str = str.replace(/-/g, '+').replace(/_/g, '/');

  const padding = str.length % 4 === 0 ? '' : '='.repeat(4 - (str.length % 4));
  str += padding;

  const buffer = Buffer.from(str, 'base64');
  return buffer.toString('utf-8');
};

const base64UrlEncode = (str) => {
  const buffer = Buffer.from(str, 'utf-8');
  let base64 = buffer.toString('base64');

  base64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return base64;
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
      return res.status(400).json({
        data: null,
        message: "User already exists",
        success: false,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into database
    const newUser = await db.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
      [username, email, hashedPassword]
    );

    return res.status(201).json({
      data: { id: newUser.rows[0].id, username, email },
      message: "User created successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in registration:", error);
    return res.status(500).json({
      data: null,
      message: "Server error",
      success: false,
    });
  }
});

// Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if (user.rows.length === 0) {
      return res.status(404).json({
        data: null,
        message: "User not found",
        success: false,
      });
    }

    // Validate password
    const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!validPassword) {
      return res.status(400).json({
        data: null,
        message: "Invalid password",
        success: false,
      });
    }

    // Generate token
    const token = generateToken({
      id: user.rows[0].id,
      email: user.rows[0].email,
    });

    // Fetch the user's role name
    const role = await db.query("SELECT role_name FROM roles WHERE id = $1", [user.rows[0].role_id]);

    // Fetch farmer details and accessibility settings if applicable
    const userId = user.rows[0].id;
    const farmerDetails = await db.query("SELECT * FROM farmer_details WHERE user_id = $1", [userId]);
    const accessibilitySettings = await db.query("SELECT * FROM accessibility_settings WHERE user_id = $1", [userId]);

    // Combine all user data
    const fullUserDetails = {
      id: user.rows[0].id,
      username: user.rows[0].name,
      email: user.rows[0].email,
      role: role.rows.length > 0 ? role.rows[0].role_name : 'UNKNOWN',  // User role
      farmerDetails: farmerDetails.rows.length > 0 ? farmerDetails.rows[0] : null,
      accessibilitySettings: accessibilitySettings.rows.length > 0 ? accessibilitySettings.rows[0] : null,
      token: token,
    };

    return res.status(200).json({
      data: fullUserDetails,
      message: "Login successful",
      success: true,
    });
  } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).json({
      data: null,
      message: "Server error",
      success: false,
    });
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
      return res.status(400).json({
        data: null,
        message: "User already exists",
        success: false,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a unique QR code hash
    const qrCodeHash = generateQrCodeHash(email);

    // Insert new user into the database
    const newUser = await db.query(
      "INSERT INTO users (name, email, password_hash, qr_code_hash) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, email, hashedPassword, qrCodeHash]
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
      data: { id: userId, username, email, qr_code_hash: qrCodeHash },
      message: "Farmer registered successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in farmer registration:", error);
    return res.status(500).json({
      data: null,
      message: "Server error",
      success: false,
    });
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
      return res.status(404).json({
        data: null,
        message: "Preferences not found for this user",
        success: false,
      });
    }

    return res.status(200).json({
      data: preferences.rows[0],
      message: "Preferences fetched successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error fetching preferences:", error);
    return res.status(500).json({
      data: null,
      message: "Server error",
      success: false,
    });
  }
});

// Token Validation Route
router.get("/validate", async (req, res) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      data: null,
      message: "Unauthorized",
      success: false,
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Decode the JWT token's payload before verifying
    const decodedPayload = base64UrlDecode(token.split('.')[1]); // Decode payload only
    console.log("Decoded Payload:", decodedPayload);

    // Verify token
    const user = jwt.verify(token, process.env.JWT_SECRET || "defaultsecret");
    return res.status(200).json({
      data: user,
      message: "Token is valid",
      success: true,
    });
  } catch (error) {
    console.error("Error in token validation:", error);
    return res.status(403).json({
      data: null,
      message: "Invalid or expired token",
      success: false,
    });
  }
});

// Fetch Farmer Details
router.get("/farmers/:qr_code", async (req, res, next) => {
  try {
    const farmer = await fetchFarmerDetails(req.params.qr_code);

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: "Farmer not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Farmer details fetched successfully",
      data: farmer,
    });
  } catch (error) {
    console.error("Error in fetching farmer details:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
    });
  }
});


const fetchFarmerDetails = async (qrCode) => {
  const query = `
    SELECT u.id, u.name, u.email, f.age, f.vision_problems, f.color_blindness, a.text_size, a.layout, a.color_friendly_scheme, a.use_symbols_with_colors
    FROM users u
    INNER JOIN farmer_details f ON u.id = f.user_id
    INNER JOIN accessibility_settings a ON u.id = a.user_id
    WHERE u.qr_code_hash = $1
  `;
  const result = await db.query(query, [qrCode]);
  return result.rows[0];
};

module.exports = router;