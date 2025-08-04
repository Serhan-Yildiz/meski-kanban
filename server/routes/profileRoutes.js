import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  getProfile,
  changePassword,
  updateSecurityInfo,
  deleteAccount,
} from "../controllers/profileController.js";

const router = express.Router();

router.use(auth);

router.get("/", getProfile);

router.put("/change-password", changePassword);

router.put("/update-security", updateSecurityInfo);

router.delete("/delete", deleteAccount);

export default router;
