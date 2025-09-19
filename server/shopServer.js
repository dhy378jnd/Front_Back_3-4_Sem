const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const PORT = 3000;
const DATA_PATH = path.join(__dirname, "../data/product.json");
const PUBLIC_DIR = path.join(__dirname, "../public");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(PUBLIC_DIR));

// Check if product.json exists
if (!fs.existsSync(DATA_PATH)) {
  console.error("Ошибка: Файл product.json не найден!");
  process.exit(1);
}

// Read product data
function getProducts() {
  try {
    const data = fs.readFileSync(DATA_PATH, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Ошибка чтения product.json:", error);
    return [];
  }
}

// API for fetching products
app.get("/products", (req, res) => {
  const products = getProducts();
  if (products.length === 0) {
    res.status(500).json({ error: "Ошибка загрузки товаров" });
  } else {
    res.json(products);
  }
});

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});
