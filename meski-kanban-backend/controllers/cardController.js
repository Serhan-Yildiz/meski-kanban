import pool from "../db/db.js";

export const getCardsByList = async (req, res) => {
  const { listId } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM cards WHERE list_id = $1 ORDER BY position ASC",
      [listId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Kart getirme hatası:", err);
    res.status(500).json({ error: "Kartlar alınamadı" });
  }
};

export const createCard = async (req, res) => {
  const { title, description, listId, position, assignedTo, labelColor } =
    req.body;

  try {
    const result = await pool.query(
      `INSERT INTO cards 
        (title, description, list_id, position, assigned_to, label_color) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [title, description, listId, position, assignedTo, labelColor]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Kart oluşturma hatası:", err);
    res.status(500).json({ error: "Kart oluşturulamadı" });
  }
};

export const updateCard = async (req, res) => {
  const { id } = req.params;
  const { title, description, position, listId, assignedTo, labelColor } =
    req.body;

  try {
    const result = await pool.query(
      `UPDATE cards SET 
         title = $1,
         description = $2,
         position = $3,
         list_id = $4,
         assigned_to = $5,
         label_color = $6,
         last_updated = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING *`,
      [title, description, position, listId, assignedTo, labelColor, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Kart güncelleme hatası:", err);
    res.status(500).json({ error: "Kart güncellenemedi" });
  }
};

export const deleteCard = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM cards WHERE id = $1", [id]);
    res.json({ message: "Kart silindi" });
  } catch (err) {
    console.error("Kart silme hatası:", err);
    res.status(500).json({ error: "Kart silinemedi" });
  }
};

export const updateCardPosition = async (req, res) => {
  const { id } = req.params;
  const { newPosition, newListId } = req.body;

  try {
    const result = await pool.query(
      `UPDATE cards 
       SET position = $1, list_id = $2, last_updated = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [newPosition, newListId, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Kart pozisyon güncelleme hatası:", err);
    res.status(500).json({ error: "Kart pozisyonu güncellenemedi" });
  }
};

export const assignUserToCard = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const result = await pool.query(
      "UPDATE cards SET assigned_to = $1, last_updated = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
      [userId, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Kullanıcı atama hatası:", err);
    res.status(500).json({ error: "Kullanıcı atanamadı" });
  }
};

export const updateLabelColor = async (req, res) => {
  const { id } = req.params;
  const { labelColor } = req.body;

  try {
    const result = await pool.query(
      "UPDATE cards SET label_color = $1, last_updated = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
      [labelColor, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Etiket rengi güncelleme hatası:", err);
    res.status(500).json({ error: "Etiket rengi güncellenemedi" });
  }
};
