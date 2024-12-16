const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

// Register User
router.post("/register", userController.register);

// Login User
router.post("/login", userController.login);

// Register Farmer with Preferences
router.post("/register-farmer", userController.registerFarmer);

// Get User Preferences
router.get("/preferences/:userId", userController.getUserPreferences);

// Token Validation Route
router.get("/validate", userController.validateToken);

router.get("/farmers/:qrCodeHash", userController.getFarmerByQrCode);


module.exports = router;
