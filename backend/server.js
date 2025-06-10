const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const jwt = require("jsonwebtoken");
const verifyToken = require("./middleware/authMiddleware.js");

dotenv.config();
const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

const USER = {
  username: process.env.USER_NAME,
  password: process.env.PASSWORD,
};

app.post("/auth/login", (req, res) => {
  const { username, password } = req.body;

  if (username === USER.username && password === USER.password) {
    const token = jwt.sign(
      {
        username,
        isAdmin: true, // Kullanıcıya admin rolü ekleyin
      },
      process.env.JWT_SECRET,
      { expiresIn: "30s" }
    );

    res.json({
      success: true,
      token,
      user: {
        username,
        isAdmin: true,
      },
    });
  } else {
    res.status(401).json({ success: false, message: "Hatalı giriş" });
  }
});

app.get("/auth/verify", verifyToken, (req, res) => {
  console.log("Verify endpoint'e istek geldi:", req.user);
  res.json({
    success: true,
    message: "Token geçerli",
    user: {
      username: req.user.username,
      isAdmin: req.user.isAdmin, // Token'daki admin bilgisini döndürün
    },
  });
});
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/products", require("./routes/products"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Bağlantısı Başarılı ✅");
    app.listen(process.env.PORT, () =>
      console.log(`Server ${process.env.PORT} portunu dinlemeye başladı ✅`)
    );
  })
  .catch((err) => console.error(err));
