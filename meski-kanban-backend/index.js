import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import boardRoutes from "./routes/boardRoutes.js";
import cardRoutes from "./routes/cardRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import listRoutes from "./routes/listRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "https://meski-kanban.vercel.app",
    credentials: true,
  })
);
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/boards", boardRoutes);
app.use("/cards", cardRoutes);
app.use("/comments", commentRoutes);
app.use("/lists", listRoutes);
app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.send("MESKİ Kanban API is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
