import db from "../db.js";

export const getBoards = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM boards WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.id]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createBoard = async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required" });

  try {
    const result = await db.query(
      "INSERT INTO boards (title, user_id) VALUES ($1, $2) RETURNING *",
      [title, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteBoard = async (req, res) => {
  const { boardId } = req.params;
  try {
    await db.query("DELETE FROM boards WHERE id = $1 AND user_id = $2", [
      boardId,
      req.user.id,
    ]);
    res.status(200).json({ message: "Board deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
