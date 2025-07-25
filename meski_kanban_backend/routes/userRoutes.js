import express from "express";
import { getUser, updateUser, deleteUser } from "../controllers/userController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", auth, getUser);
router.put("/me", auth, updateUser);
router.delete("/me", auth, deleteUser);

export default router;
