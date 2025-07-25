import express from "express";
import { getProfile, changePassword } from "../controllers/profileController.js";
import auth from "../authMiddleware.js";

const router = express.Router();

router.get("/me", auth, getProfile);
router.put("/change-password", auth, changePassword);

export default router;
