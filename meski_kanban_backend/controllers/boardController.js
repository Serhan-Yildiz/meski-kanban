import pool from "../db.js";

export async function getBoards(req, res) {
  try {
    const result = await pool.query(
      "SELECT * FROM boards WHERE owner_id = $1 ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: "Boardlar getirilemedi." });
  }
}

export async function createBoard(req, res) {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: "Başlık gerekli." });

  try {
    const result = await pool.query(
      "INSERT INTO boards (title, owner_id) VALUES ($1, $2) RETURNING *",
      [title, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ error: "Board oluşturulamadı." });
  }
}

export async function updateBoard(req, res) {
  const { title } = req.body;
  const boardId = req.params.id;

  try {
    const result = await pool.query(
      "UPDATE boards SET title = $1 WHERE id = $2 AND owner_id = $3 RETURNING *",
      [title, boardId, req.user.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: "Board bulunamadı." });

    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: "Board güncellenemedi." });
  }
}

export async function deleteBoard(req, res) {
  const boardId = req.params.id;

  try {
    const result = await pool.query(
      "DELETE FROM boards WHERE id = $1 AND owner_id = $2",
      [boardId, req.user.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: "Board bulunamadı." });

    res.json({ message: "Board silindi." });
  } catch {
    res.status(500).json({ error: "Board silinemedi." });
  }
}
