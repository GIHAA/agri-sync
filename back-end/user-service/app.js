const express = require("express");
const cors = require("cors"); 
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();
const sequelize = require("./config/database");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);

sequelize.sync({ force: true }).then(() => {
  console.log("Database synced");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
