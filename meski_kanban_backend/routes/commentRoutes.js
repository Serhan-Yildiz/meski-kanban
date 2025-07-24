import express from "express";
import {
  getComments,
  createComment,
  deleteComment,
} from "./commentController.js";
import { authenticate } from "./authMiddleware.js";

const router = express.Router();

router.get("/:cardId", authenticate, getComments);
router.post("/:cardId", authenticate, createComment);
router.delete("/:commentId", authenticate, deleteComment);

export default router;
