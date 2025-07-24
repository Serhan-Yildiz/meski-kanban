import express from "express";
import passport from "passport";
import { login, register, getProfile } from "../controllers/authController.js";
import { authenticate } from "../authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);

// ✅ Giriş yapan kullanıcının profilini döner
router.get("/me", authenticate, getProfile);

// ✅ Google Auth
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
