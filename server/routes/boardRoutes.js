import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  getBoards,
  createBoard,
  updateBoard,
  deleteBoard,
  getBoardById,
  getListsWithCardsByBoardId,
} from "../controllers/boardController.js";

const router = express.Router();

router.use(auth);

router.get("/", getBoards);
router.post("/", createBoard);
router.put("/:id", updateBoard);
router.delete("/:id", deleteBoard);
router.get("/:id", getBoardById);
router.get("/:id/lists", getListsWithCardsByBoardId);

export default router;
