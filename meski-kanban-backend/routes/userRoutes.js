import express from "express";
import { getAllUsers } from "../controllers/userController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/", verifyToken, getAllUsers);
export default router;
