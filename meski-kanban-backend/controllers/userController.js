import pool from "../db/db.js";

export const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email FROM users ORDER BY name ASC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Kullanıcı listeleme hatası:", err);
    res.status(500).json({ error: "Kullanıcılar getirilemedi" });
  }
};
