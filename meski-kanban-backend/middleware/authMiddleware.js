import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ error: "Token eksik" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // req.user içine id, email, role geliyor
    next();
  } catch (err) {
    console.error("Token doğrulama hatası:", err);
    res.status(403).json({ error: "Geçersiz token" });
  }
};
