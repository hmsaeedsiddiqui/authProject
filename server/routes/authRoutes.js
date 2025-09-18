import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

// Match frontend API calls
router.post("/signup", registerUser);
router.post("/login", loginUser);

export default router;
