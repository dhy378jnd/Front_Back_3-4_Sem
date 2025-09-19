const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 4000 });

const clients = new Map();

wss.on("connection", (ws, req) => {
    const isAdmin = req.headers.origin.includes("8080");
    clients.set(ws, isAdmin ? "Администрация" : "Пользователь");
    console.log(`Новое подключение: ${clients.get(ws)}`);

    ws.on("message", message => {
        console.log(`Сообщение от ${clients.get(ws)}:`, message.toString());
        const formattedMessage = `${clients.get(ws)}: ${message.toString()}`;
        clients.forEach((role, client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(formattedMessage);
            }
        });
    });

    ws.on("close", () => {
        console.log(`Отключился: ${clients.get(ws)}`);
        clients.delete(ws);
    });
});

console.log("WebSocket сервер запущен на порту 4000");