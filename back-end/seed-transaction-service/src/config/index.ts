import dotenv from 'dotenv';
dotenv.config();  // Load environment variables from .env

/*
Protocol: postgres:// – tells the system to use PostgreSQL.
Username: transaction_db – the username used for database authentication.
Password: transaction_db_password – the password for the user transaction_db.
Host: localhost – the address of the PostgreSQL server (in this case, on the local machine).
Port: 5433 – the port the PostgreSQL server is listening on (alternative to the default 5432).
Database Name: transaction_service – the specific database to which the connection is made.
*/
export const config = {
  db: {
    connectionString:
      process.env.DATABASE_URL || "postgres://transaction_db:admin@localhost:5436/transaction_service",
    user: process.env.DB_USER || "transaction_db",
    host: process.env.DB_HOST || "localhost",
    name: process.env.DB_NAME || "transaction_service",
    password: process.env.DB_PASSWORD || "admin",
    port: Number(process.env.DB_PORT) || 5436,
    pool: {
      max: parseInt(process.env.DB_POOL_MAX || "10", 10),
      min: parseInt(process.env.DB_POOL_MIN || "2", 10),
      idle: parseInt(process.env.DB_POOL_IDLE || "10000", 10),
    },
  },

  // blockchain: {
  //   connectionPath: process.env.BLOCKCHAIN_CONNECTION_PATH || "./connection.json",
  //   walletPath: process.env.BLOCKCHAIN_WALLET_PATH || "./wallet",
  //   identity: process.env.BLOCKCHAIN_IDENTITY || "adminUser",
  //   channelName: process.env.BLOCKCHAIN_CHANNEL_NAME || "seedtransactions-channel",
  //   contractName: process.env.BLOCKCHAIN_CONTRACT_NAME || "seedContract",
  //   timeout: parseInt(process.env.BLOCKCHAIN_TIMEOUT || "30000", 10),
  // },

  server: {
    port: parseInt(process.env.PORT || "3004", 10),
    environment: process.env.NODE_ENV || "localhost",
    // corsEnabled: process.env.CORS_ENABLED === "true",
    // corsOptions: {
    //   origin: process.env.CORS_ORIGIN || "*",
    //   methods: process.env.CORS_METHODS || "GET,POST,PUT,DELETE,OPTIONS",
    //   allowedHeaders: process.env.CORS_HEADERS || "Content-Type,Authorization",
    // },
  },

  // logger: {
  //   level: process.env.LOG_LEVEL || "info",
  //   logToFile: process.env.LOG_TO_FILE === "true",
  //   logFilePath: process.env.LOG_FILE_PATH || "./logs/app.log",
  //   logToConsole: process.env.LOG_TO_CONSOLE !== "false",
  // },

  // security: {
  //   enableRateLimiting: process.env.ENABLE_RATE_LIMITING === "true",
  //   rateLimitOptions: {
  //     windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
  //     max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10),
  //   },
  //   enableHelmet: process.env.ENABLE_HELMET === "true",
  // },

  // features: {
  //   enableDetailedLogs: process.env.ENABLE_DETAILED_LOGS === "true",
  //   enableDebugMode: process.env.DEBUG_MODE === "true",
  // },
};
