import db from "../config/db.js";

export const getUser = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, name, email FROM users WHERE id = $1",
      [req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUser = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Name is required" });

  try {
    const result = await db.query(
      "UPDATE users SET name = $1 WHERE id = $2 RETURNING id, name, email",
      [name, req.user.id]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await db.query("DELETE FROM users WHERE id = $1", [req.user.id]);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
