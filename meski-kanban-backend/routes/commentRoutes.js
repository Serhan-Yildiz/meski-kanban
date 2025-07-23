import express from "express";
import {
  getCommentsByCard,
  addComment,
} from "../controllers/commentController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:cardId", verifyToken, getCommentsByCard);
router.post("/", verifyToken, addComment);

export default router;
