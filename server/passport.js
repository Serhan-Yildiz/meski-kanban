import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import pool from "./config/db.js";

const GOOGLE_AUTH = "google";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const name = profile.displayName;

        const { rows } = await pool.query(
          "SELECT * FROM users WHERE email = $1",
          [email]
        );

        if (rows.length > 0) {
          return done(null, rows[0]);
        }

        const { rows: newUserRows } = await pool.query(
          "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
          [name, email, GOOGLE_AUTH]
        );

        return done(null, newUserRows[0]);
      } catch (err) {
        console.error("Google OAuth error:", err);
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});
