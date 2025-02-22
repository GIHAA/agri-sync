const pointsSettingsRepo = require("../repository/pointSettingsRepo");
const logger = require("../utils/logger");

const getPointSettings = async (req, res) => {
  try {
    logger.info('Fetching point settings');
    const settings = await pointsSettingsRepo.getAllSettings();
    
    return res.status(200).json({
      success: true,
      data: settings,
      message: "Point settings retrieved successfully"
    });
  } catch (error) {
    logger.error(`Error fetching point settings: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Error retrieving point settings"
    });
  }
};

const updatePointSettings = async (req, res) => {
  try {
    const settings = req.body;
    logger.info('Updating point settings', settings);
    
    // Validate input
    if (!settings.event || settings.points === undefined) {
      return res.status(400).json({
        success: false,
        message: "Event and points are required"
      });
    }
    
    const result = await pointsSettingsRepo.updateSetting(settings);
    
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    logger.error(`Error updating point settings: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Error updating point settings"
    });
  }
};

module.exports = {
  getPointSettings,
  updatePointSettings
};