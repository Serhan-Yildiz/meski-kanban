import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Yetkilendirme reddedildi" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Kullanıcı bilgilerini request'e ekle
    next();
  } catch (error) {
    return res.status(403).json({ message: "Geçersiz token" });
  }
};

export default authMiddleware;
