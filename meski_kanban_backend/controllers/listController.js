import pool from "../config/db.js";

export const getLists = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM lists WHERE board_id = $1",
      [req.params.boardId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("getLists error:", error.message);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

export const createList = async (req, res) => {
  try {
    const { title, board_id } = req.body;
    const result = await pool.query(
      "INSERT INTO lists (title, board_id) VALUES ($1, $2) RETURNING *",
      [title, board_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("createList error:", error.message);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

export const updateList = async (req, res) => {
  try {
    const { title } = req.body;
    const result = await pool.query(
      "UPDATE lists SET title = $1 WHERE id = $2 RETURNING *",
      [title, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("updateList error:", error.message);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

export const deleteList = async (req, res) => {
  try {
    await pool.query("DELETE FROM lists WHERE id = $1", [req.params.id]);
    res.json({ message: "Liste silindi" });
  } catch (error) {
    console.error("deleteList error:", error.message);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};
