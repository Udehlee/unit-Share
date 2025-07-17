import pg from "pg";
import dotenv from "dotenv";
import logger from "../utils/logger.js"

const { Client } = pg;

const loadEnv = dotenv.config();
if(loadEnv.error) throw new Error("failed to load env. file")

const client = new Client({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: Number(process.env.POSTGRES_PORT),
});

const connectDB = async () => {
  try{
    await client.connect()
    logger.info("connected successfully to postgres")

  }catch(err){
    logger.error("failed to connect to postgres", err)
    process.exit(1)


  }

}

export default { client, connectDB };
