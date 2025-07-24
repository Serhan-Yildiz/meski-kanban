import express from "express";
import {
  getLists,
  createList,
  updateList,
  deleteList,
} from "../controllers/listController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/:boardId", getLists);
router.post("/", createList);
router.put("/:id", updateList);
router.delete("/:id", deleteList);

export default router;
