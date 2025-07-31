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

export const updateCard = async (req, res) => {
  const { id } = req.params;
  const { title, description, priority, is_done } = req.body;

  try {
    const result = await pool.query(
      `UPDATE cards 
       SET 
         title = COALESCE($1, title),
         description = COALESCE($2, description),
         priority = COALESCE($3, priority),
         is_done = COALESCE($4, is_done),
         updated_at = NOW()
       WHERE id = $5
       RETURNING *`,
      [title, description, priority, is_done, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Kart bulunamadı" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Kart güncellenemedi:", err);
    res
      .status(500)
      .json({ message: "Kart güncellenemedi", error: err.message });
  }
};

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
    const maxRes = await pool.query(
      "SELECT MAX(position) AS max FROM cards WHERE list_id = $1",
      [listId]
    );

    const newPosition = (maxRes.rows[0].max || 0) + 1;

    const result = await pool.query(
      `INSERT INTO cards (title, list_id, position) 
       VALUES ($1, $2, $3) RETURNING *`,
      [title, listId, newPosition]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Kart eklenirken hata:", err);
    res.status(500).json({ message: "Kart oluşturulamadı" });
  }
}

export async function moveCardUp(req, res) {
  const cardId = req.params.id;

  try {
    const cardRes = await pool.query("SELECT * FROM cards WHERE id = $1", [
      cardId,
    ]);
    const card = cardRes.rows[0];

    if (!card) return res.status(404).json({ message: "Kart bulunamadı" });

    const aboveRes = await pool.query(
      `SELECT * FROM cards 
       WHERE list_id = $1 AND position < $2 
       ORDER BY position DESC LIMIT 1`,
      [card.list_id, card.position]
    );

    if (aboveRes.rows.length === 0) {
      return res.status(400).json({ message: "Kart en üstte" });
    }

    const above = aboveRes.rows[0];

    await pool.query("UPDATE cards SET position = $1 WHERE id = $2", [
      above.position,
      card.id,
    ]);
    await pool.query("UPDATE cards SET position = $1 WHERE id = $2", [
      card.position,
      above.id,
    ]);

    res.json({ message: "Kart yukarı taşındı" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Kart yukarı taşınamadı" });
  }
}

export async function moveCardDown(req, res) {
  const cardId = req.params.id;

  try {
    const cardRes = await pool.query("SELECT * FROM cards WHERE id = $1", [
      cardId,
    ]);
    const card = cardRes.rows[0];

    if (!card) return res.status(404).json({ message: "Kart bulunamadı" });

    const belowRes = await pool.query(
      `SELECT * FROM cards 
       WHERE list_id = $1 AND position > $2 
       ORDER BY position ASC LIMIT 1`,
      [card.list_id, card.position]
    );

    if (belowRes.rows.length === 0) {
      return res.status(400).json({ message: "Kart en altta" });
    }

    const below = belowRes.rows[0];

    await pool.query("UPDATE cards SET position = $1 WHERE id = $2", [
      below.position,
      card.id,
    ]);
    await pool.query("UPDATE cards SET position = $1 WHERE id = $2", [
      card.position,
      below.id,
    ]);

    res.json({ message: "Kart aşağı taşındı" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Kart aşağı taşınamadı" });
  }
}
