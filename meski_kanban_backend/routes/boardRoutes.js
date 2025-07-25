import express from "express";
import pool from "../db.js";
import { authenticate } from "../authMiddleware.js";

const router = express.Router();

router.get("/", authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM boards WHERE owner_id = $1 ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

router.post("/", authenticate, async (req, res) => {
  const { title } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO boards (title, owner_id) VALUES ($1, $2) RETURNING *",
      [title, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(400).json({ error: "Board oluşturulamadı" });
  }
});

router.put("/:id", authenticate, async (req, res) => {
  const { title } = req.body;
  try {
    const result = await pool.query(
      "UPDATE boards SET title = $1 WHERE id = $2 AND owner_id = $3 RETURNING *",
      [title, req.params.id, req.user.id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ error: "Board bulunamadı" });
    res.json(result.rows[0]);
  } catch {
    res.status(400).json({ error: "Güncellenemedi" });
  }
});

router.delete("/:id", authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM boards WHERE id = $1 AND owner_id = $2",
      [req.params.id, req.user.id]
    );
    if (result.rowCount === 0)
      return res.status(404).json({ error: "Board bulunamadı" });
    res.json({ message: "Silindi" });
  } catch {
    res.status(400).json({ error: "Silinemedi" });
  }
});

export default router;
