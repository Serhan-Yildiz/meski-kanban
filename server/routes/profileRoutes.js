import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  getProfile,
  changePassword,
} from "../controllers/profileController.js";

const router = express.Router();

router.get("/me", auth, getProfile);
router.put("/change-password", auth, changePassword);

export default router;
