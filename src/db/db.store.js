import { user } from "../models/userModel.js";
import { logger } from "../utils/logger.js";
import { client } from "./db.conn.js";

const createUser = async (data) => {
  const { fullname, email, password, meterNumber, unitBalance } = data;
  const query = ` 
     INSERT INTO users (fullname, email, password, meter_number, unit_balance)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id,fullname,email,meter_number,unit_balance);`;

  const result = await client.query(query, [
    fullname,
    email,
    password,
    meterNumber,
    unitBalance,
  ]);

  return user(result.rows[0]);
};

const checkEmail = async () => {
  try {
    const query = `SELECT * FROM users WHERE email = $1`;
    const result = await client.query(query, [email]);

    if (result.rows.length === 0) {
      logger.info("No user found with email: " + email);
      return null;
    }

    const user = user(result.rows[0]);
    return user;
  } catch (err) {
    logger.error("Error fetching user by email");
    throw err;
  }
};

export default { createUser, checkEmail };
