const { PointSettings } = require("../models/PointSettings");
const logger = require("../utils/logger");

const getAllSettings = async () => {
  logger.info("Fetching all point settings");
  return await PointSettings.findAll({
    attributes: ['id', 'event', 'points'],
    order: [['createdAt', 'ASC']]
  });
};

const updateSetting = async (updateData) => {
  try {
    logger.info(`Updating point setting: ${JSON.stringify(updateData)}`);
    
    // Find the setting by event
    const pointSetting = await PointSettings.findOne({
      where: { event: updateData.event }
    });

    if (!pointSetting) {
      logger.warn(`Point setting not found for event: ${updateData.event}`);
      return {
        success: false,
        message: `Point setting for ${updateData.event} not found`
      };
    }

    // Update only the points field
    await pointSetting.update({ 
      points: updateData.points 
    });

    return {
      success: true,
      data: pointSetting,
      message: "Point settings updated successfully"
    };
  } catch (error) {
    logger.error(`Error updating point setting: ${error.message}`);
    return {
      success: false,
      message: "Error updating point settings"
    };
  }
};

module.exports = {
  getAllSettings,
  updateSetting
};