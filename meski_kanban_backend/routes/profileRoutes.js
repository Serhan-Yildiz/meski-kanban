import express from "express";
import {
  getProfile,
  changePassword,
} from "../controllers/profileController.js";
import { authenticate } from "../authMiddleware.js";

const router = express.Router();

router.get("/profile", authenticate, getProfile);
router.put("/change-password", authenticate, changePassword);

export default router;
