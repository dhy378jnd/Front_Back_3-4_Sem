const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 8080;
const PUBLIC_DIR = path.join(__dirname, "../public");
const DATA_PATH = path.join(__dirname, "../data/product.json");

const server = http.createServer((req, res) => {
  let filePath = path.join(PUBLIC_DIR, req.url === "/" ? "admin.html" : req.url);

  if (req.url === "/") {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Ошибка сервера при загрузке admin.html");
      } else {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(data);
      }
    });

  } else if (req.url.endsWith(".js") || req.url.endsWith(".css")) {
    fs.readFile(filePath, "utf8", (err, content) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Файл не найден");
      } else {
        let contentType = req.url.endsWith(".js") ? "application/javascript" : "text/css";
        res.writeHead(200, { "Content-Type": `${contentType}; charset=utf-8` });
        res.end(content);
      }
    });

  } else if (req.method === "PUT" && req.url.startsWith("/edit/")) {
    const id = parseInt(req.url.split("/")[2]);
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      try {
        const updatedProduct = JSON.parse(body);
        fs.readFile(DATA_PATH, "utf8", (err, data) => {
          if (err) {
            res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
            return res.end("Ошибка сервера");
          }
          let products = JSON.parse(data);
          let productIndex = products.findIndex(p => p.id === id);
          if (productIndex === -1) {
            res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
            return res.end("Товар не найден");
          }
          products[productIndex] = { ...products[productIndex], ...updatedProduct };
          fs.writeFile(DATA_PATH, JSON.stringify(products, null, 2), err => {
            if (err) {
              res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
              return res.end("Ошибка при редактировании");
            }
            res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("Товар обновлен");
          });
        });
      } catch (e) {
        res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Ошибка обработки данных");
      }
    });
  } else if (req.method === "POST" && req.url === "/add") {
    let body = "";
    req.on("data", chunk => (body += chunk));
    req.on("end", () => {
      try {
        const newProduct = JSON.parse(body);

        fs.readFile(DATA_PATH, "utf8", (err, data) => {
          if (err) {
            res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
            return res.end("Ошибка сервера при загрузке данных");
          }

          let products = JSON.parse(data);

          let maxId = products.length > 0 ? Math.max(...products.map(p => p.id)) : 0;
          newProduct.id = maxId + 1;

          products.push(newProduct);

          fs.writeFile(DATA_PATH, JSON.stringify(products, null, 2), err => {
            if (err) {
              res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
              return res.end("Ошибка при сохранении товара");
            }
            res.writeHead(201, { "Content-Type": "text/plain; charset=utf-8" });
            res.end(`Товар добавлен с ID: ${newProduct.id}`);
          });
        });

      } catch (error) {
        res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Ошибка обработки данных");
      }
    });
  } else if (req.method === "DELETE" && req.url.startsWith("/delete/")) {
    const id = parseInt(req.url.split("/")[2]);

    fs.readFile(DATA_PATH, "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        return res.end("Ошибка сервера при загрузке данных");
      }

      let products = JSON.parse(data);
      const initialLength = products.length;

      products = products.filter(product => product.id !== id);

      if (products.length === initialLength) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        return res.end("Товар с таким ID не найден");
      }

      fs.writeFile(DATA_PATH, JSON.stringify(products, null, 2), err => {
        if (err) {
          res.writeHead(500, {"Content-Type": "text/plain; charset=utf-8"});
          return res.end("Ошибка при удалении товара");
        }
        res.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"});
        res.end(`Товар с ID ${id} удален`);
      });
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Страница не найдена");
  }
});

server.listen(PORT, () => console.log(`Админка сотрудников запущена: http://localhost:${PORT}`));