import express from "express";
import {
  getListsByBoard,
  createList,
  updateListPosition,
} from "../controllers/listController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:boardId", verifyToken, getListsByBoard);
router.post("/", verifyToken, createList);
router.patch("/position/:id", verifyToken, updateListPosition);

export default router;
