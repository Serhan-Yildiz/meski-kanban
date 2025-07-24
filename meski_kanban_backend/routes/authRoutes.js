import express from "express";
import passport from "passport";
import {
  login,
  register,
  getProfile,
  changePassword,
} from "../controllers/authController.js";
import { authenticate } from "../authMiddleware.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/me", authenticate, getProfile);
router.put("/change-password", authenticate, changePassword);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    res.redirect(`https://meski-kanban.vercel.app/auth/success?token=${token}`);
  }
);

export default router;
