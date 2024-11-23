const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER || "admin",
  password: process.env.DB_PASSWORD || "admin",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "agri",
});

// Function to run migrations
const runMigrations = async () => {
  const filePath = path.join(__dirname, "../db.sql"); 
  try {
    const sql = fs.readFileSync(filePath, "utf-8"); 
    await pool.query(sql); 
    console.log("Database migrations executed successfully.");
  } catch (err) {
    console.error("Error running migrations:", err);
  }
};

// Initialize database and run migrations on startup
(async () => {
  try {
    await pool.connect();
    console.log("Connected to the PostgreSQL database");
    await runMigrations(); 
  } catch (err) {
    console.error("Failed to connect to the PostgreSQL database:", err);
  }
})();

module.exports = {
  query: (text, params) => pool.query(text, params),
};
