const express = require("express");
const cors = require("cors"); 
const authRoutes = require("./routes/authRoutes");
require("dotenv").config(); 

const app = express();
const PORT = process.env.PORT || 9000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
