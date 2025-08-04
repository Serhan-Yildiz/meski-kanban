import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db.js";

export const register = async (req, res) => {
  const { name, email, password, security_question, security_answer } =
    req.body;

  try {
    const password_hash = await bcrypt.hash(password, 10);
    const security_answer_hashed = await bcrypt.hash(security_answer, 10);

    await db.query(
      `INSERT INTO users (name, email, password_hash, security_question, security_answer_hashed)
       VALUES ($1, $2, $3, $4, $5)`,
      [name, email, password_hash, security_question, security_answer_hashed]
    );

    res.status(201).json({ message: "Kayıt başarılı" });
  } catch (err) {
    console.error("🔴 register hatası:", err);
    res.status(500).json({ message: "Kayıt başarısız", error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({ message: "Şifre yanlış" });
    }

    const token = jwt.sign(
      { id: user.id, provider: "local" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      name: user.name,
      email: user.email,
      id: user.id,
    });
  } catch (err) {
    console.error("🔴 login hatası:", err);
    res.status(500).json({ message: "Giriş başarısız", error: err.message });
  }
};

export const getSecurityQuestion = async (req, res) => {
  const { email } = req.body;

  try {
    const result = await db.query(
      "SELECT security_question FROM users WHERE email = $1",
      [email]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    res.json({ question: result.rows[0].security_question });
  } catch (err) {
    console.error("🔴 getSecurityQuestion hatası:", err);
    res.status(500).json({ message: "Bir hata oluştu", error: err.message });
  }
};

export const resetPassword = async (req, res) => {
  const { email, answer, newPassword } = req.body;

  try {
    const result = await db.query(
      "SELECT security_answer_hashed FROM users WHERE email = $1",
      [email]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    const match = await bcrypt.compare(
      answer,
      result.rows[0].security_answer_hashed
    );
    if (!match) {
      return res.status(403).json({ message: "Güvenlik cevabı yanlış" });
    }

    const password_hash = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE users SET password_hash = $1 WHERE email = $2", [
      password_hash,
      email,
    ]);

    res.json({ message: "Şifre başarıyla güncellendi" });
  } catch (err) {
    console.error("🔴 resetPassword hatası:", err);
    res
      .status(500)
      .json({ message: "Şifre sıfırlanamadı", error: err.message });
  }
};
