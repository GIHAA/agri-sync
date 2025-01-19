const express = require("express");
const router = express.Router();
const settingsController = require("../controllers/pointSettingsController");
const protect = require("../middleware/protect");

router.get("/", protect, settingsController.getPointSettings);
router.put("/", protect, settingsController.updatePointSettings);

module.exports = router;
