import express from "express";
import {
  getProfile,
  changePassword,
  updateSecurityInfo,
  deleteAccount,
} from "../controllers/profileController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", auth, getProfile);
router.put("/profile/change-password", auth, changePassword);
router.put("/profile/security-question", auth, updateSecurityInfo);
router.delete("/profile/delete", auth, deleteAccount);

export default router;
