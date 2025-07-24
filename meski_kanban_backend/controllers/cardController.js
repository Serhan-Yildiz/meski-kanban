import db from "../db.js";

export const getCards = async (req, res) => {
  const { listId } = req.params;
  try {
    const result = await db.query(
      "SELECT * FROM cards WHERE list_id = $1 ORDER BY position ASC",
      [listId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createCard = async (req, res) => {
  const { title, description, position } = req.body;
  const { listId } = req.params;
  if (!title) return res.status(400).json({ message: "Title is required" });

  try {
    const result = await db.query(
      "INSERT INTO cards (title, description, position, list_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, description || "", position || 0, listId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteCard = async (req, res) => {
  const { cardId } = req.params;
  try {
    await db.query("DELETE FROM cards WHERE id = $1", [cardId]);
    res.status(200).json({ message: "Card deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
