import express from "express";
import { getBoards, createBoard, deleteBoard } from "../controllers/boardController.js";
import { authenticate } from "./authMiddleware.js";

const router = express.Router();

router.get("/", authenticate, getBoards);
router.post("/", authenticate, createBoard);
router.delete("/:boardId", authenticate, deleteBoard);

export default router;
