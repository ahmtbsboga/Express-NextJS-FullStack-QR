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

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.json());

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
