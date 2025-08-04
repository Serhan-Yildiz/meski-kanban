import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  getAllLists,
  getListById,
  getListsByBoardId,
  createList,
  updateList,
  deleteList,
  moveList,
} from "../controllers/listController.js";

const router = express.Router();

router.use(auth);

router.get("/", getAllLists);
router.get("/:id", getListById);
router.get("/board/:boardId", getListsByBoardId);
router.post("/board/:boardId", createList);
router.put("/:id", updateList);
router.delete("/:id", deleteList);
router.put("/:id/move", moveList);


export default router;
