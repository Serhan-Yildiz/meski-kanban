import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import {
  login,
  register,
  getSecurityQuestion,
  resetPassword,
} from "../controllers/authController.js";
import auth from "../middleware/authMiddleware.js";
import { getProfile } from "../controllers/profileController.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);

router.post("/reset-step1", getSecurityQuestion);
router.post("/reset-password", resetPassword);

router.get("/profile", auth, getProfile);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, provider: "google" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
  }
);

export default router;
