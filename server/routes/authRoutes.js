import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import {
  login,
  register,
  getProfile,
  changePassword,
  getSecurityQuestion,
  resetPassword,
} from "../controllers/authController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/profile", auth, getProfile);
router.put("/change-password", auth, changePassword);
router.post("/reset-step1", getSecurityQuestion);
router.post("/reset-password", resetPassword);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign(
      {
        id: req.user.id,
        email: req.user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
  }
);

export default router;
