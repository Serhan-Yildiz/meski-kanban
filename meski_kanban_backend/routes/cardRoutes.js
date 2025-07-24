import express from "express";
import { getCards, createCard, deleteCard } from "..controllers/cardController.js";
import { authenticate } from "./authMiddleware.js";

const router = express.Router();

router.get("/:listId", authenticate, getCards);
router.post("/:listId", authenticate, createCard);
router.delete("/:cardId", authenticate, deleteCard);

export default router;
