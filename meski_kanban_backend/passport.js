import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import db from "./db.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email)
          return done(new Error("No email found from Google profile"));

        const existingUser = await db.query(
          "SELECT * FROM users WHERE email = $1",
          [email]
        );
        if (existingUser.rows.length > 0) {
          return done(null, existingUser.rows[0]);
        }

        const result = await db.query(
          "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
          [profile.displayName, email, "google-oauth"]
        );

        done(null, result.rows[0]);
      } catch (err) {
        console.error(err);
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    done(null, result.rows[0]);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
