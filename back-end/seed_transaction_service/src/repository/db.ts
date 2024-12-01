import { Pool, PoolClient } from "pg";
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
      max: config.db.pool.max || 10,
      min: config.db.pool.min || 2,
      idleTimeoutMillis: config.db.pool.idle || 10000,
    }),
});


export const query = async (text: string, params?: any[]): Promise<any> => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;

    if (process.env.NODE_ENV !== "production") {
      console.log("Executed query", { text, duration, rows: result.rowCount });
    }

    return result;
  } catch (error) {
    console.error("Database query error:", { text, error });
    throw error;
  }
};

export const connect = async (): Promise<PoolClient> => {
  try {
    const client = await pool.connect();
    return client;
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
};

export const transaction = async <T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> => {
  const client = await connect();
  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Transaction failed. Rolled back changes:", error);
    throw error;
  } finally {
    client.release();
  }
};

export default { query, connect, transaction };
