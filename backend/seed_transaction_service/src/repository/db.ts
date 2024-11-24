import { Pool } from "pg";
import { config } from "../config";

const pool = new Pool({
  connectionString: config.db.connectionString,
  ...(config.db.connectionString
    ? {}
    : {
      user: config.db.user,
      host: config.db.host,
      database: config.db.name,
      password: config.db.password,
      port: config.db.port,
    }),
});


export const query = async (text: string, params?: any[]): Promise<any> => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log("Executed query", { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error("Database query error:", { text, error });
    throw error;
  }
};


export const connect = async () => {
  try {
    const client = await pool.connect();
    return client;
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
};

export default { query, connect };
