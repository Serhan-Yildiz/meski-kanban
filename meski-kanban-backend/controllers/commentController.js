import pool from "../config/db.js";

export const getComments = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM comments WHERE card_id = $1",
      [req.params.cardId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("getComments error:", error.message);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

export const createComment = async (req, res) => {
  try {
    const { content, card_id } = req.body;
    const { userId } = req.user;

    const result = await pool.query(
      "INSERT INTO comments (content, card_id, user_id) VALUES ($1, $2, $3) RETURNING *",
      [content, card_id, userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("createComment error:", error.message);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { content } = req.body;
    const result = await pool.query(
      "UPDATE comments SET content = $1 WHERE id = $2 RETURNING *",
      [content, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("updateComment error:", error.message);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    await pool.query("DELETE FROM comments WHERE id = $1", [req.params.id]);
    res.json({ message: "Yorum silindi" });
  } catch (error) {
    console.error("deleteComment error:", error.message);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};
