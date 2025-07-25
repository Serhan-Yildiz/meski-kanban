import db from "../db.js";

export const getBoards = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM boards WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.id]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createBoard = async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.user?.id;

    if (!title || !userId) {
      return res
        .status(400)
        .json({ message: "Başlık ve kullanıcı bilgisi zorunludur." });
    }

    const result = await pool.query(
      "INSERT INTO boards (title, user_id) VALUES ($1, $2) RETURNING *",
      [title, userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Board oluşturma hatası:", error.message);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

export const deleteBoard = async (req, res) => {
  const { boardId } = req.params;
  try {
    await db.query("DELETE FROM boards WHERE id = $1 AND user_id = $2", [
      boardId,
      req.user.id,
    ]);
    res.status(200).json({ message: "Board deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
