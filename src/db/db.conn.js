import pg from "pg";
import dotenv from "dotenv";
import logger from "../utils/logger.js";

const { Pool } = pg;

const loadEnv = dotenv.config();
if (loadEnv.error) throw new Error("failed to load env. file");

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: Number(process.env.POSTGRES_PORT),
});

const connectDB = async () => {
  try {
    const client = await pool.connect();
    logger.info("Connected successfully to PostgreSQL");
    client.release(); 
  } catch (err) {
    logger.error("Failed to connect to PostgreSQL", err);
    process.exit(1);
  }
};

export { pool, connectDB };