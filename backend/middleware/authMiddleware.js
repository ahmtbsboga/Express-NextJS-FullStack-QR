const jwt = require("jsonwebtoken");

module.exports = function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1]; // "Bearer token" şeklinden token'ı al

  if (!token) {
    return res.status(401).json({ message: "Token bulunamadı" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Geçersiz token" });
  }
};
