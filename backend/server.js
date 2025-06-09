const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

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
  console.log("Login route çalıştı");

  const { username, password } = req.body;
  if (username === USER.username && password === USER.password) {
    res.json({ success: true, token: process.env.JWT_SECRET });
  } else {
    res.status(401).json({ success: false, message: "Hatalı giriş" });
  }
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
