const userService = require("../service/userService");

// Register User
const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const result = await userService.registerUser(username, email, password);
    if (!result.success) {
      return res.status(result.statusCode).json(result);
    }

    return res.status(201).json(result);
  } catch (error) {
    console.error("Error in registration:", error);
    return res.status(500).json({
      data: null,
      message: "Server error",
      success: false,
    });
  }
};




// Login User
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await userService.loginUser(email, password);
    if (!result.success) {
      return res.status(result.statusCode).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in login:", error);
    return res.status(500).json({
      data: null,
      message: "Server error",
      success: false,
    });
  }
};

// Register Farmer with Preferences
const registerFarmer = async (req, res) => {
  const {
    username,
    email,
    password,
    age,
    vision_problems,
    color_blindness,
    text_size,
    layout,
    color_friendly_scheme,
    use_symbols_with_colors,
    lat,
    long
  } = req.body;

  try {
    const result = await userService.registerFarmer(
      username,
      email,
      password,
      age,
      vision_problems,
      color_blindness,
      text_size,
      layout,
      color_friendly_scheme,
      use_symbols_with_colors,
      lat,
      long
    );

    if (!result.success) {
      return res.status(result.statusCode).json(result);
    }

    return res.status(201).json(result);
  } catch (error) {
    console.error("Error in farmer registration:", error);
    return res.status(500).json({
      data: null,
      message: "Server error",
      success: false,
    });
  }
};

// Get User Preferences
const getUserPreferences = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await userService.getUserPreferences(userId);

    if (!result.success) {
      return res.status(result.statusCode).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching preferences:", error);
    return res.status(500).json({
      data: null,
      message: "Server error",
      success: false,
    });
  }
};

// Token Validation Route
const validateToken = async (req, res) => {
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
};


const getAllUsers = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const result = await userService.getAllUsers(page, limit);
    if (!result.success) {
      return res.status(result.statusCode).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      data: null,
      message: "Server error",
      success: false,
    });
  }
};

// Get One User
const getUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await userService.getUser(userId);
    if (!result.success) {
      return res.status(result.statusCode).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({
      data: null,
      message: "Server error",
      success: false,
    });
  }
};

// Update User
const updateUser = async (req, res) => {
  const { userId } = req.params;
  const updateData = req.body;
  try {
    const result = await userService.updateUser(userId, updateData);
    if (!result.success) {
      return res.status(result.statusCode).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({
      data: null,
      message: "Server error",
      success: false,
    });
  }
};

const getFarmerByQrCode = async (req, res) => {
  console.log("Request Params:", req.params);
  const { qrCodeHash } = req.params;

  try {
    const result = await userService.getFarmerDetails(qrCodeHash);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }
  } catch (error) {
    console.error("Error in controller layer:", error.message);
    return res.status(500).json({
      success: false,
      data: null,
      message: "Server error",
    });
  }
};

// Add to exports
module.exports = {
  register,
  login,
  registerFarmer,
  getUserPreferences,
  validateToken,
  getAllUsers,
  getUser,
  updateUser,
  getFarmerByQrCode,
};