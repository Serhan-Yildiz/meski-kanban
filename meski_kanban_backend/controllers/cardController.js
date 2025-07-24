import pool from "../config/db.js";

export const getCards = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM cards WHERE list_id = $1",
      [req.params.listId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("getCards error:", error.message);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

export const createCard = async (req, res) => {
  try {
    const { title, description, list_id } = req.body;
    const result = await pool.query(
      "INSERT INTO cards (title, description, list_id) VALUES ($1, $2, $3) RETURNING *",
      [title, description, list_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("createCard error:", error.message);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

export const updateCard = async (req, res) => {
  try {
    const { title, description, list_id } = req.body;
    const result = await pool.query(
      "UPDATE cards SET title = $1, description = $2, list_id = $3 WHERE id = $4 RETURNING *",
      [title, description, list_id, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("updateCard error:", error.message);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

export const deleteCard = async (req, res) => {
  try {
    await pool.query("DELETE FROM cards WHERE id = $1", [req.params.id]);
    res.json({ message: "Kart silindi" });
  } catch (error) {
    console.error("deleteCard error:", error.message);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};
