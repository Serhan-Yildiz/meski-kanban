import express from "express";
import {
  getCardsByList,
  createCard,
  updateCard,
  deleteCard,
  updateCardPosition,
  assignUserToCard,
  updateLabelColor,
} from "../controllers/cardController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:listId", verifyToken, getCardsByList);
router.post("/", verifyToken, createCard);
router.put("/:id", verifyToken, updateCard);
router.delete("/:id", verifyToken, deleteCard);
router.patch("/position/:id", verifyToken, updateCardPosition);
router.patch("/assign/:id", verifyToken, assignUserToCard);
router.patch("/label/:id", verifyToken, updateLabelColor);

export default router;
