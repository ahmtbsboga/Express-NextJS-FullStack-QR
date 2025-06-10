// uploads klasörü oluştur
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// route içinde
router.post("/products", upload.single("image"), async (req, res) => {
  const { name, description, price, category } = req.body;
  const imageUrl = `/uploads/${req.file.filename}`;

  const product = await Product.create({
    name,
    description,
    price,
    category,
    imageUrl,
  });

  res.json({ message: "Ürün başarıyla eklendi", product });
});
