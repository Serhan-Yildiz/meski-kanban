import pool from "../db/db.js";

export const getCommentsByCard = async (req, res) => {
  const { cardId } = req.params;

  try {
    const result = await pool.query(
      `SELECT comments.*, users.name 
       FROM comments 
       JOIN users ON comments.user_id = users.id
       WHERE card_id = $1
       ORDER BY created_at ASC`,
      [cardId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Yorum getirme hatası:", err);
    res.status(500).json({ error: "Yorumlar alınamadı" });
  }
};

export const addComment = async (req, res) => {
  const { cardId, content } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO comments (card_id, user_id, content) VALUES ($1, $2, $3) RETURNING *",
      [cardId, req.user.id, content]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Yorum ekleme hatası:", err);
    res.status(500).json({ error: "Yorum eklenemedi" });
  }
};
