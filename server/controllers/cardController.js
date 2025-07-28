import pool from "../config/db.js";

export async function getCardById(req, res) {
  const cardId = req.params.id;

  try {
    const result = await pool.query("SELECT * FROM cards WHERE id = $1", [
      cardId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Kart bulunamadı" });
    }

    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ message: "Kart alınamadı" });
  }
}

export async function updateCard(req, res) {
  const cardId = req.params.id;
  const { title, description } = req.body;

  try {
    const result = await pool.query(
      "UPDATE cards SET title = $1, description = $2 WHERE id = $3 RETURNING *",
      [title, description, cardId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Kart bulunamadı" });
    }

    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ message: "Kart güncellenemedi" });
  }
}

export async function deleteCard(req, res) {
  const cardId = req.params.id;

  try {
    await pool.query("DELETE FROM cards WHERE id = $1", [cardId]);
    res.json({ message: "Kart silindi" });
  } catch {
    res.status(500).json({ message: "Kart silinemedi" });
  }
}

export async function createCard(req, res) {
  const { listId, title } = req.body;

  if (!title || !listId) {
    return res.status(400).json({ message: "Başlık ve liste ID gerekli" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO cards (title, list_id) VALUES ($1, $2) RETURNING *",
      [title, listId]
    );
    res.status(201).json(result.rows[0]);
  } catch {
    res.status(500).json({ message: "Kart oluşturulamadı" });
  }
}
