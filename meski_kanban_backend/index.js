import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import "./passport.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);


// Root
app.get("/", (req, res) => {
  res.send("MESKI Trello-Clone API is running");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
