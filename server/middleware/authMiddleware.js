import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token bulunamadı" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, provider: decoded.provider };
    next();
  } catch (error) {
    console.error("JWT doğrulama hatası:", error.message);
    res.status(401).json({ message: "Geçersiz token" });
  }
};

export default auth;
