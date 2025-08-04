import pool from "../config/db.js";
import bcrypt from "bcrypt";

export async function getProfile(req, res) {
  try {
    const result = await pool.query(
      "SELECT id, name, email, password_hash FROM users WHERE id = $1",
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    const user = result.rows[0];
    const isGoogleUser = user.password_hash === "google";

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      isGoogleUser,
    });
  } catch (err) {
    console.error("🔴 getProfile hatası:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
}

export async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;

  try {
    const { rows } = await pool.query(
      "SELECT id, password_hash FROM users WHERE id = $1",
      [req.user.id]
    );
    const user = rows[0];

    if (!user || user.password_hash === "google") {
      return res.status(400).json({
        message: "Google ile giriş yapan kullanıcı şifre değiştiremez.",
      });
    }

    const match = await bcrypt.compare(currentPassword, user.password_hash);
    if (!match) {
      return res.status(401).json({ message: "Mevcut şifre hatalı" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [
      hashed,
      req.user.id,
    ]);

    res.json({ message: "Şifre başarıyla güncellendi" });
  } catch (err) {
    console.error("🔴 changePassword hatası:", err);
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
    const { rows } = await pool.query(
      "SELECT password_hash FROM users WHERE id = $1",
      [req.user.id]
    );
    const user = rows[0];

    if (!user || user.password_hash === "google") {
      return res.status(400).json({
        message:
          "Google ile giriş yapan kullanıcı güvenlik sorusu değiştiremez.",
      });
    }

    const hashedAnswer = await bcrypt.hash(answer, 10);

    await pool.query(
      "UPDATE users SET security_question = $1, security_answer_hashed = $2 WHERE id = $3",
      [question, hashedAnswer, req.user.id]
    );

    res.json({ message: "Güvenlik sorusu başarıyla güncellendi" });
  } catch (err) {
    console.error("🔴 updateSecurityInfo hatası:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
}

export async function deleteAccount(req, res) {
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [req.user.id]);
    res.json({ message: "Hesap başarıyla silindi" });
  } catch (err) {
    console.error("🔴 deleteAccount hatası:", err);
    res.status(500).json({ message: "Hesap silinemedi", error: err.message });
  }
}
