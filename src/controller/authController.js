import logger from "../utils/logger.js";
import { saveUser, checkEmail, saveTransaction  } from "../db/db.store.js";
import argon2 from 'argon2'

//signup creates new user account
const signup = async (req, res) => {
  const { fullname, email, password, meterNumber, meterType, unitBalance } = req.body;

  if (!fullname || !email || !password || !meterNumber|| !meterType || unitBalance === undefined) {
    logger.error("Missing user fields");
    return res.status(422).json({ success: false, message: "All fields are required" });
  }

  try {
    const existingUser = await checkEmail(email);
    if (existingUser) {
      logger.info("User already exists with email: " + email);
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    const hashedPasswd = await argon2.hash(password);
    const newUser = await saveUser({
      fullname,
      email,
      password: hashedPasswd, 
      meterNumber,
      unitBalance,
    });

    logger.info("User created successfully: " + email);
    return res.status(201).json({ success: true, message: "User created successfully", data: newUser });
  } catch (err) {
    logger.error("failed to signin user" + err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//login logs in existing user
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  try {
    const existingUser = await checkEmail(email);
    if (!existingUser) {
      return res.status(401).json({ success: false, message: "user details are invalid" });
    }

    const confirmPassword = await argon2.verify(existingUser.password, password);
    if (!confirmPassword) {
      return res.status(401).json({ success: false, message: "wrong password" });
    }

    logger.debug("User logged in successfully:", username)
    const loggedInUser = {
      success: true,
      message: "Login successful",
      data: {
        email: existingUser.email,
      },
    };

    return res.status(200).json(loggedInUser);
  } catch (err) {
    logger.error("failed to Login in user: " + err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//transaction creates transaction record upon sucessful transfer
const transaction = async (req, res) => {
  const { senderId, recipientId, unitsTransferred } = req.body

  if (!senderId || !recipientId || !unitsTransferred ) {
    return res.status(400).json({ success: false, message: "senderId, recipientId and unitsTransferred are required" });
  }

try {
    const trxn = await saveTransaction({
      senderId,
      recipientId,
      unitsTransferred,
    });

    return res.status(201).json({
      success: true,
      message: "Transaction completed successfully",
      data: trxn,
    });
  } catch (err) {
    logger.error("Failed to complete transaction" + err);
    return res.status(500).json({success: false, message: "Internal server error"});
  }
};

export { signup, login, transaction }
