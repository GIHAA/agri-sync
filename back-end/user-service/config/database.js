// config/database.js
const { Sequelize } = require("sequelize");
require("dotenv").config();
const logger = require("../utils/logger"); 

const sequelize = new Sequelize({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USER || "admin",
  password: process.env.DB_PASSWORD || "admin",
  database: process.env.DB_NAME || "agri",
  dialect: "postgres",
  // for ssl
  dialectOptions: {
    ssl: {
      require: process.env.DB_SSL === 'true',
      rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true'
    }
  }
});

// Test the connection and log the result
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info("Connection to the database has been established successfully.");
  } catch (error) {
    logger.error(`Unable to connect to the database: ${error.message}`);
  }
};

testConnection();

module.exports = sequelize;
