import { Router } from "express";
import { signup, login, transaction } from "../controller/authController.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/transaction", transaction);

export default router;
