import db from "../db.js";

export const getLists = async (req, res) => {
  const { boardId } = req.params;
  try {
    const result = await db.query(
      "SELECT * FROM lists WHERE board_id = $1 ORDER BY position ASC",
      [boardId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createList = async (req, res) => {
  const { title, position } = req.body;
  const { boardId } = req.params;
  if (!title) return res.status(400).json({ message: "Title is required" });

  try {
    const result = await db.query(
      "INSERT INTO lists (title, position, board_id) VALUES ($1, $2, $3) RETURNING *",
      [title, position || 0, boardId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteList = async (req, res) => {
  const { listId } = req.params;
  try {
    await db.query("DELETE FROM lists WHERE id = $1", [listId]);
    res.status(200).json({ message: "List deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
