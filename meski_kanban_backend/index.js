// index.js (Refactored)

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import boardRoutes from "./routes/boardRoutes.js";
import listRoutes from "./routes/listRoutes.js";
import cardRoutes from "./routes/cardRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

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
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/boards", boardRoutes);
app.use("/lists", listRoutes);
app.use("/cards", cardRoutes);
app.use("/comments", commentRoutes);

// Root
app.get("/", (req, res) => {
  res.send("MESKI Trello-Clone API is running");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
