import app from "./expressApp";
import { config } from "./config";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: config.db.connectionString,
  ...(config.db.connectionString
    ? {} : {
      user: config.db.user,
      host: config.db.host,
      database: config.db.name,
      password: config.db.password,
      port: config.db.port,
      max: config.db.pool.max || 10,
      min: config.db.pool.min || 2,
      idleTimeoutMillis: config.db.pool.idle || 10000,
    }),
});

export const startServer = async () => {
  try {
    await pool.connect();
    console.log(`Database connected successfully on port ${config.db.port}`);

    app.listen(config.server.port, () => {
      console.log(`Server running on port ${config.server.port}`);
    });
  } catch (error) {
    console.error("Error starting the server or connecting to the database:", error);
    process.exit(1);
  }
};

startServer();
