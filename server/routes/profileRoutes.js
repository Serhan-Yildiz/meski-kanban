import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  getProfile,
  changePassword,
  updateSecurityInfo,
  deleteAccount,
} from "../controllers/profileController.js";

const router = express.Router();

router.get("/", auth, getProfile);
router.put("/change-password", auth, changePassword);
router.put("/update-security", auth, updateSecurityInfo);
router.delete("/delete", auth, deleteAccount);

export default router;
