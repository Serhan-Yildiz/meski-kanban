import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token bulunamadı" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id }; // 🔧 sadece kullanıcı ID'sini aktar
    next();
  } catch (error) {
    console.error("JWT doğrulama hatası:", error.message);
    res.status(401).json({ message: "Geçersiz token" });
  }
};

export default authenticate;
