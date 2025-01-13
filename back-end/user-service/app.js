// server.js
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const logger = require("./utils/logger"); 

require("dotenv").config();
const sequelize = require("./config/database");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);

// health check
app.get("/health", (req, res) => {
  res.json({ message: "User Service is running" });
});

// Syncing the database with logging
sequelize.sync({ alter: true })
  .then(() => {
    logger.info("Database synced successfully.");
  })
  .catch((error) => {
    logger.error(`Database sync error: ${error.message}`);
  });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
