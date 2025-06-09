const Product = require("../models/products");

exports.createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res
      .status(201)
      .json({ message: "Ürün başarıyla eklendi", product: newProduct });
  } catch (error) {
    res.status(500).json({ message: "Ürün eklenemedi", error: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    console.log("Gelen kategori:", req.query.category);
    const category = req.query.category;

    let filter = {};
    if (category && category !== "all") {
      filter.category = category;
    }

    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Ürün bulunamadı" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Ürün alınamadı", error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    console.log("Güncelleme ID:", req.params.id);
    console.log("Güncelleme body:", req.body);

    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    console.log("DB’den gelen güncel ürün:", updated);

    if (!updated) {
      return res.status(404).json({ message: "Ürün bulunamadı" });
    }

    res.json({ message: "Ürün güncellendi", product: updated });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Ürün güncellenemedi", error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Ürün silindi" });
  } catch (err) {
    res.status(500).json({ message: "Ürün silinemedi", error: err.message });
  }
};
