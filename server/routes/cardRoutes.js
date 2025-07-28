import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  getCardById,
  updateCard,
  deleteCard,
  createCard,
} from "../controllers/cardController.js";

const router = express.Router();

router.use(auth);

router.get("/:id", getCardById);
router.put("/:id", updateCard);
router.delete("/:id", deleteCard);
router.post("/", createCard);

export default router;
