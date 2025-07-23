import pool from "../db/db.js";

export const getListsByBoard = async (req, res) => {
  const { boardId } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM lists WHERE board_id = $1 ORDER BY position ASC",
      [boardId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Liste getirme hatası:", err);
    res.status(500).json({ error: "Listeler alınamadı" });
  }
};

export const createList = async (req, res) => {
  const { title, boardId, position } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO lists (title, board_id, position) VALUES ($1, $2, $3) RETURNING *",
      [title, boardId, position]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Liste oluşturma hatası:", err);
    res.status(500).json({ error: "Liste oluşturulamadı" });
  }
};

export const updateListPosition = async (req, res) => {
  const { id } = req.params;
  const { newPosition } = req.body;

  try {
    const result = await pool.query(
      `UPDATE lists SET position = $1 WHERE id = $2 RETURNING *`,
      [newPosition, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Liste pozisyon güncelleme hatası:", err);
    res.status(500).json({ error: "Liste pozisyonu güncellenemedi" });
  }
};
