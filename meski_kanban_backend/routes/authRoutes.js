import express from "express";
import { register, login, logout } from "./authController.js";

const router = express.Router();

// Auth Routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

export default router;
