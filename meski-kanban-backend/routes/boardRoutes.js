import express from "express";
import { getBoards, createBoard } from "../controllers/boardController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, getBoards);
router.post("/", verifyToken, createBoard);

export default router;
