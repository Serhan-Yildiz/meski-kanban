import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import "./passport.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import boardRoutes from "./routes/boardRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/boards", boardRoutes);

app.get("/", (req, res) => {
  res.send("MESKI Trello-Clone API is running");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
