// index.js (Refactored)

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";

import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import boardRoutes from "./boardRoutes.js";
import listRoutes from "./listRoutes.js";
import cardRoutes from "./cardRoutes.js";
import commentRoutes from "./commentRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

// Optional: session (Google auth eklenince aktif olacak)
// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false,
// }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/lists", listRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/comments", commentRoutes);

// Root
app.get("/", (req, res) => {
  res.send("MESKI Trello-Clone API is running");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
