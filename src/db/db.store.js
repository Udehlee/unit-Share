import { user } from "../models/userModel.js";
import { logger } from "../utils/logger.js";
import { pool } from "./db.conn.js";

const client = await pool.connect();

//saveUser Saves a new user 
export const saveUser = async (data) => {
  const { fullname, email, password, meterNumber, meterType, unitBalance } = data;
  const createdAt = new Date();
  const query = ` 
    INSERT INTO users (fullname, email, pass_word, meter_number, meter_type, unit_balance, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, fullname, email, meter_number, meter_type, unit_balance, created_at;
  `;

  const result = await client.query(query, [fullname, email, password, meterNumber, meterType, unitBalance,createdAt]);
  return user(result.rows[0]);
};

//checkEmail Checks if a user with the given email exists in the database
export const checkEmail = async (email) => {
  try {
    const query = `SELECT * FROM users WHERE email = $1`;
    const result = await  client.query(query, [email]);

    if (result.rows.length === 0) {
      logger.info("No user found with email: " + email);
      return null;
    }
    const User = user(result.rows[0]);
    return User;
  } catch (err) {
    logger.error("Error fetching user by email");
    throw err;
  }
};

//saveTransaction Saves the transaction after transferring units between users
export const saveTransaction = async (data) => {
  const { senderId, recipientId, unitsTransferred } = data;
  const createdAt = new Date();

  const senderquery ="SELECT units_balance FROM users WHERE id = $1 FOR UPDATE";
  const sender = await client.query(senderquery, [senderId]);
  if (sender.rows.length == 0) {
    logger.error("Sender not found, stopping the transaction");
    throw new Error("Sender not found");
  }

  const recipientquery ="SELECT units_balance FROM users WHERE id = $1 FOR UPDATE";
  const recipient = await client.query(recipientquery, [recipientId]);
  if (recipient.rows.length == 0) {
    logger.error("Recipient not found, stopping the transaction");
    throw new Error("Recipient not found");
  }

  const senderUnitBal = sender.rows[0].unit_balance;
  if (senderUnitBal < unitsTransferred) {
    logger.error("sender has Insufficient units" + senderUnitBal);
    throw new Error("Insufficient units balance");
  }

  try {
    await client.query("BEGIN");

    await client.query("UPDATE users SET units_balance = units_balance - $1 WHERE id = $2",[unitsTransferred, senderId]);
    await client.query("UPDATE users SET units_balance = units_balance + $1 WHERE id = $2",[unitsTransferred, recipientId]);

    const result = await client.query(
      `INSERT INTO transactions (sender_id, recipient_id, units_transferred)
       VALUES($1,$2,$3)
       RETURNING id, sender_id, recipient_id, units_transferred, status, created_at`,
      [senderId, recipientId, unitsTransferred, "success", createdAt]
    );

    await client.query("COMMIT");
    return result.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    logger.error("Rollback Transaction:", err);
    throw err;
  } finally {
    client.release();
  }
};


