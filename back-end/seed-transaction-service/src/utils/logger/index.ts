import { pinoHttp } from "pino-http";
import pino from "pino";

// Configure the logger
export const logger = pino({
  level: "info", // Set the default log level
  base: {
    serviceName: "seed_transaction_service", // The service name for easy identification in logs
  },
  serializers: pino.stdSerializers, // Default serializers for common types like Error
  timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`, // Custom timestamp format
  transport: {
    target: "pino-pretty", // Use pino-pretty for local development
    level: "error", // Capture only error level logs in production
  },
});


export const httpLogger = pinoHttp({
  level: "error", // Log only errors for HTTP requests
  logger,
});
