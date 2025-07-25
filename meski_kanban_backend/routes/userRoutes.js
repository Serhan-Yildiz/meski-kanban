import express from "express";
import { getUser, updateUser, deleteUser } from "../controllers/userController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", authenticate, getUser);
router.put("/me", authenticate, updateUser);
router.delete("/me", authenticate, deleteUser);

export default router;
