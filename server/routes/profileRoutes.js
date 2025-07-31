import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  getProfile,
  changePassword,
} from "../controllers/profileController.js";

const router = express.Router();

router.get("/",getProfile);
router.put("/change-password", changePassword);

export default router;
