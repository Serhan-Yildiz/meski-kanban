import express from "express";
import {
  getBoards,
  createBoard,
  updateBoard,
  deleteBoard,
} from "../controllers/boardController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(auth);

router.get("/", getBoards);
router.post("/", createBoard);
router.put("/:id", updateBoard);
router.delete("/:id", deleteBoard);

export default router;
