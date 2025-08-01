import pool from "../config/db.js";
import bcrypt from "bcrypt";

export async function getProfile(req, res) {
  try {
    const result = await pool.query(
      "SELECT id, name, email FROM users WHERE id = $1",
      [req.user.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ message: "Sunucu hatası" });
  }
}

export async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;

  try {
    const userQuery = await pool.query("SELECT * FROM users WHERE id = $1", [
      req.user.id,
    ]);
    const user = userQuery.rows[0];

    if (!user.password)
      return res.status(400).json({
        message: "Google hesabı ile giriş yapan kullanıcı şifre değiştiremez.",
      });

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return res.status(401).json({ message: "Mevcut şifre hatalı" });

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password = $1 WHERE id = $2", [
      hashed,
      req.user.id,
    ]);

    res.json({ message: "Şifre başarıyla güncellendi" });
  } catch {
    res.status(500).json({ message: "Sunucu hatası" });
  }
}

export async function updateSecurityInfo(req, res) {
  const { question, answer } = req.body;

  if (!question || !answer) {
    return res
      .status(400)
      .json({ message: "Güvenlik sorusu ve cevabı zorunludur." });
  }

  try {
    const hashedAnswer = await bcrypt.hash(answer, 10);

    await pool.query(
      "UPDATE users SET security_question = $1, security_answer_hashed = $2 WHERE id = $3",
      [question, hashedAnswer, req.user.id]
    );

    res.json({ message: "Güvenlik sorusu ve cevabı güncellendi." });
  } catch (err) {
    console.error("Güvenlik sorusu güncelleme hatası:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
}
