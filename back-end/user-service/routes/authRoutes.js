const express = require("express");
const userController = require("../controllers/userController");
const protect = require("../middleware/protect");

const router = express.Router();

// Register User
router.post("/register-admin", userController.register);

// Add this to your existing router file
router.get("/users", userController.getAllUsers);

// Login User
router.post("/login", userController.login);

// Register Farmer with Preferences
router.post("/register-farmer", userController.registerFarmer);

// Get User Preferences
router.get("/preferences/:userId", protect, userController.getUserPreferences);

// Token Validation Route
router.get("/validate", userController.validateToken);

router.get("/users/:userId", protect, userController.getUser);

router.put("/users/:userId", protect, userController.updateUser);

router.get("/farmers/:qrCodeHash", userController.getFarmerByQrCode);
module.exports = router;
