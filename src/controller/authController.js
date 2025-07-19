import { logger } from "../utils/logger.js";
import { store } from "../db/db.store.js";
import argon2 from 'argon2';

//signup creates new user account
const signup = async (req, res) => {
  const { fullname, email, password, meterNumber, unitBalance } = req.body;

  if (!fullname || !email || !password || !meterNumber || unitBalance === undefined) {
    logger.error("Missing user fields");
    return res.status(422).json({ success: false, message: "All fields are required" });
  }

  try {
    const existingUser = await user.checkEmail(email);
    if (existingUser) {
      logger.info("User already exists with email: " + email);
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    const hashedPasswd = await argon2.hash(password);
    const newUser = await store.createUser({
      fullname,
      email,
      password: hashedPasswd, 
      meterNumber,
      unitBalance,
    });

    logger.info("User created successfully: " + email);
    return res.status(201).json({ success: true, message: "User created successfully", data: newUser });
  } catch (err) {
    logger.error("error Signin in: " + err);
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
    const existingUser = await store.checkEmail(email);
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
    logger.error("error Login in: " + err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export default { signup, login}
