const express = require("express");
const cors = require("cors");
const rewardRoutes = require("./routes/rewardRoutes");
const farmingRoutes = require("./routes/farmingRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const logger = require("./utils/logger");
require("dotenv").config();
const sequelize = require("./config/database");
const { ensurePointSettings } = require("./models/PointSettings");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/rewards", rewardRoutes);
app.use("/farming", farmingRoutes);
app.use("/rewards-settings", settingsRoutes)

// health check
app.get("/health", (req, res) => {
  res.json({ message: "Reward Service is running" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

//Syncing the database with logging
// sequelize.sync({ alter: true })
//   .then(async () => {
//     logger.info("Database synced successfully.");
//     await ensurePointSettings(); 
//   })
//   .catch((error) => {
//     logger.error(`Database sync error: ${error.message}`);
//   });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});