const express = require("express");
const cors = require("cors"); // Import CORS middleware
const authRoutes = require("./routes/authRoutes");
require("dotenv").config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 9000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

// Routes
app.use("/auth", authRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});