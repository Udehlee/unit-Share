import { Router } from "express";
import { signup, login, transaction } from "../controller/authController.js";

const router = Router();

router.post("/api/signup", signup);
router.post("/api/login", login);
router.post("/api/transaction", transaction);

export default router;
