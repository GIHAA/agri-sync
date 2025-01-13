// routes/rewardRoutes.js
const express = require("express");
const rewardController = require("../controllers/rewardController");
const protect = require("../middleware/protect");
const logger = require("../utils/logger");

const router = express.Router();

// Log when a request is received
router.use((req, res, next) => {
  logger.info(`Received ${req.method} request for ${req.originalUrl}`);
  next();
});

// Get user's total reward points
router.get("/points", protect, rewardController.getUserPoints);

// Get reward activity history
router.get("/activity-history", protect, rewardController.getActivityHistory);

// Redeem points for rewards
router.post("/redeem", protect, rewardController.redeemPoints);

// Add points for user
router.post("/add", protect, rewardController.addPoints);

// Update points for user
router.post("/update", protect, rewardController.updatePoints);

module.exports = router;
