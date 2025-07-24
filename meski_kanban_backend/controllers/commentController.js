import db from "../db.js";

export const getComments = async (req, res) => {
  const { cardId } = req.params;
  try {
    const result = await db.query(
      "SELECT * FROM comments WHERE card_id = $1 ORDER BY created_at ASC",
      [cardId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createComment = async (req, res) => {
  const { text } = req.body;
  const { cardId } = req.params;
  if (!text) return res.status(400).json({ message: "Text is required" });

  try {
    const result = await db.query(
      "INSERT INTO comments (text, card_id, user_id) VALUES ($1, $2, $3) RETURNING *",
      [text, cardId, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteComment = async (req, res) => {
  const { commentId } = req.params;
  try {
    await db.query("DELETE FROM comments WHERE id = $1 AND user_id = $2", [
      commentId,
      req.user.id,
    ]);
    res.status(200).json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
