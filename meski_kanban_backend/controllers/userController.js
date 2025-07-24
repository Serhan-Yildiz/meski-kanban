import pool from "../config/db.js";

export const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.user;

    const result = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Kullanıcı profili hatası:", error.message);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};
