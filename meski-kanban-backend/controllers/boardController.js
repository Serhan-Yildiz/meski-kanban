import pool from "../config/db.js";

export const getBoards = async (req, res) => {
  try {
    const { userId } = req.user;
    const result = await pool.query(
      "SELECT * FROM boards WHERE user_id = $1",
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("getBoards error:", error.message);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

export const getBoardById = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM boards WHERE id = $1",
      [req.params.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("getBoardById error:", error.message);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

export const createBoard = async (req, res) => {
  try {
    const { title } = req.body;
    const { userId } = req.user;

    const result = await pool.query(
      "INSERT INTO boards (title, user_id) VALUES ($1, $2) RETURNING *",
      [title, userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("createBoard error:", error.message);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

export const updateBoard = async (req, res) => {
  try {
    const { title } = req.body;

    const result = await pool.query(
      "UPDATE boards SET title = $1 WHERE id = $2 RETURNING *",
      [title, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("updateBoard error:", error.message);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

export const deleteBoard = async (req, res) => {
  try {
    await pool.query("DELETE FROM boards WHERE id = $1", [req.params.id]);
    res.json({ message: "Pano silindi" });
  } catch (error) {
    console.error("deleteBoard error:", error.message);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};
