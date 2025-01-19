const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const logger = require("../utils/logger");

// Define enum for point events
const PointEvents = {
  MARKET_INSIGHT: 'market_insight',
  PREMIUM_PREDICTION: 'premium_prediction',
  FARMING_DATA: 'farming_data'
};

// Define the model with explicit table name
const PointSettings = sequelize.define("PointSettings", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  event: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isIn: [[
        PointEvents.MARKET_INSIGHT, 
        PointEvents.PREMIUM_PREDICTION, 
        PointEvents.FARMING_DATA
      ]]
    }
  },
  points: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  }
}, {
  tableName: 'PointSettings',
});

// Hooks for logging
PointSettings.addHook('afterCreate', (pointSettings, options) => {
  logger.info(`New Point settings entry created for event ${pointSettings.event}: ${pointSettings.points} points`);
});

PointSettings.addHook('afterUpdate', (pointSettings, options) => {
  logger.info(`Point settings updated for event ${pointSettings.event}: ${pointSettings.points} points`);
});

// Function to seed initial data
const seedPointSettings = async () => {
  try {
    // Check if data already exists
    const existingSettings = await PointSettings.count();
    
    if (existingSettings === 0) {
      await PointSettings.bulkCreate([
        { event: PointEvents.MARKET_INSIGHT, points: 100 },
        { event: PointEvents.PREMIUM_PREDICTION, points: 150 },
        { event: PointEvents.FARMING_DATA, points: 200 }
      ]);
      logger.info('Point settings seeded successfully');
    } else {
      logger.info('Point settings already exist');
    }
  } catch (error) {
    logger.error('Error seeding point settings:', error);
    
    // If unique constraint violation, try to handle or log more details
    if (error.name === 'SequelizeUniqueConstraintError') {
      logger.error('Unique constraint violation:', error.errors);
    }
  }
};

// Function to ensure seeds are present
const ensurePointSettings = async () => {
  try {
    for (const eventKey of Object.keys(PointEvents)) {
      const event = PointEvents[eventKey];
      const [setting, created] = await PointSettings.findOrCreate({
        where: { event },
        defaults: { 
          points: event === PointEvents.MARKET_INSIGHT ? 100 :
                  event === PointEvents.PREMIUM_PREDICTION ? 150 : 200 
        }
      });
      
      if (created) {
        logger.info(`Created point setting for ${event}`);
      }
    }
  } catch (error) {
    logger.error('Error ensuring point settings:', error);
  }
};

// Export the model, events, and seeding functions
module.exports = {
  PointSettings,
  PointEvents,
  seedPointSettings,
  ensurePointSettings
};