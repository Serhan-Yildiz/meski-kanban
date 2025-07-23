import pool from "../db/db.js";

export const getBoards = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM boards WHERE owner_id = $1",
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Board getirme hatası:", err);
    res.status(500).json({ error: "Board alınamadı" });
  }
};

export const createBoard = async (req, res) => {
  const { title } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO boards (title, owner_id) VALUES ($1, $2) RETURNING *",
      [title, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Board oluşturma hatası:", err);
    res.status(500).json({ error: "Board oluşturulamadı" });
  }
};
