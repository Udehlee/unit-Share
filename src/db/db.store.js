import { user } from "../models/userModel.js";
import { logger } from "../utils/logger.js";
import { client } from "./db.conn.js";


const saveUser = async (data) => {
  const { fullname, email, password, meterNumber, meterType, unitBalance } = data;
  const createdAt = new Date();

  const query = ` 
    INSERT INTO users (fullname, email, pass_word, meter_number, meter_type, unit_balance, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, fullname, email, meter_number, meter_type, unit_balance, created_at;
  `;

  const result = await client.query(query, [
    fullname,
    email,
    password,
    meterNumber,
    meterType,
    unitBalance,
    createdAt,
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


const saveTransaction = async (data) => {
  const { senderId, recipientId, unitsTransferred } = data
  const createdAt = new Date();

  const senderquery = "SELECT units_balance FROM users WHERE id = $1 FOR UPDATE" 
  const { sender } = await client.query(senderquery, [senderId]);
  if (sender.rows.length == 0) { 
     logger.error("Sender not found, stopping the transaction");
     throw new Error("Sender not found");
  }

  const recipientquery = "SELECT units_balance FROM users WHERE id = $1 FOR UPDATE" 
  const { recipient } = await client.query(recipientquery, [recipientId]);
  if (recipient.rows.length == 0) { 
    logger.error("Recipient not found, stopping the transaction");
    throw new Error("Recipient not found");
  }

  const senderUnitBal = sender.rows[0].unitBalance;
  if (senderUnitBal < unitsTransferred){
    throw new Error('Insufficient units balance');
  }

try{
   await client.query("BEGIN");

}catch{

}

};



export default { saveUser, checkEmail, saveTransaction };