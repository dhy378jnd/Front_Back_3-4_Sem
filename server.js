const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Раздача статических файлов
app.use(express.static(path.join(__dirname, "public")));

// Основная страница
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Страница 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
