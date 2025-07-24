import express from "express";
import { getLists, createList, deleteList } from "./listController.js";
import { authenticate } from "./authMiddleware.js";

const router = express.Router();

router.get("/:boardId", authenticate, getLists);
router.post("/:boardId", authenticate, createList);
router.delete("/:listId", authenticate, deleteList);

export default router;
