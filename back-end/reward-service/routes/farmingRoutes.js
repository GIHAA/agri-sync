// routes/farmingRoutes.js
const express = require("express");
const router = express.Router();
const farmingController = require("../controllers/farmingController");
const protect = require("../middleware/protect");

router.get("/farming-data", protect ,  farmingController.getAllFarmingData);
router.get("/farming-data/:id", protect , farmingController.getFarmingDataById);
router.post("/farming-data", protect , farmingController.createFarmingData);
router.put("/farming-data/:id", protect , farmingController.updateFarmingData);
router.delete("/farming-data/:id", protect , farmingController.deleteFarmingData);

module.exports = router;
