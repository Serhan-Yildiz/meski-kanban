import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import pool from "./config/db.js";

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
},
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      const name = profile.displayName;

      let user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

      if (user.rows.length === 0) {
        const insert = await pool.query(
          "INSERT INTO users (email, name) VALUES ($1, $2) RETURNING *",
          [email, name]
        );
        return done(null, insert.rows[0]);
      }

      return done(null, user.rows[0]);
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  done(null, result.rows[0]);
});
