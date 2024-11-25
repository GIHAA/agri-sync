export const config = {
  db: {
    connectionString:
      process.env.DATABASE_URL || "postgres://user_db:transaction_db_password@localhost:5433/transaction_service",
    user: process.env.DB_USER || "user_db",
    host: process.env.DB_HOST || "localhost",
    name: process.env.DB_NAME || "transaction_service",
    password: process.env.DB_PASSWORD || "transaction_db_password",
    port: Number(process.env.DB_PORT) || 5433,
    pool: {
      max: parseInt(process.env.DB_POOL_MAX || "10", 10),
      min: parseInt(process.env.DB_POOL_MIN || "2", 10),
      idle: parseInt(process.env.DB_POOL_IDLE || "10000", 10),
    },
  },

  // Blockchain Configuration
  blockchain: {
    connectionPath: process.env.BLOCKCHAIN_CONNECTION_PATH || "./connection.json",
    walletPath: process.env.BLOCKCHAIN_WALLET_PATH || "./wallet",
    identity: process.env.BLOCKCHAIN_IDENTITY || "appUser",
    channelName: process.env.BLOCKCHAIN_CHANNEL_NAME || "mychannel",
    contractName: process.env.BLOCKCHAIN_CONTRACT_NAME || "seedContract",
    timeout: parseInt(process.env.BLOCKCHAIN_TIMEOUT || "30000", 10),
  },

  // Server Configuration
  server: {
    port: parseInt(process.env.PORT || "3000", 10),
    environment: process.env.NODE_ENV || "development",
    corsEnabled: process.env.CORS_ENABLED === "true",
    corsOptions: {
      origin: process.env.CORS_ORIGIN || "*",
      methods: process.env.CORS_METHODS || "GET,POST,PUT,DELETE,OPTIONS",
      allowedHeaders: process.env.CORS_HEADERS || "Content-Type,Authorization",
    },
  },

  logger: {
    level: process.env.LOG_LEVEL || "info",
    logToFile: process.env.LOG_TO_FILE === "true",
    logFilePath: process.env.LOG_FILE_PATH || "./logs/app.log",
    logToConsole: process.env.LOG_TO_CONSOLE !== "false",
  },

  security: {
    enableRateLimiting: process.env.ENABLE_RATE_LIMITING === "true",
    rateLimitOptions: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
      max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10),
    },
    enableHelmet: process.env.ENABLE_HELMET === "true",
  },

  features: {
    enableDetailedLogs: process.env.ENABLE_DETAILED_LOGS === "true",
    enableDebugMode: process.env.DEBUG_MODE === "true",
  },
};
