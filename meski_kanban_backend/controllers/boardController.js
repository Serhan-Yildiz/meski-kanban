import pool from "../db.js";

export const createBoard = async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.user?.id;

    if (!title || !userId) {
      return res.status(400).json({ message: "Başlık ve kullanıcı bilgisi zorunludur." });
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
