const WebSocket = require('ws');

const PORT = 8080;
const wss = new WebSocket.Server({ port: PORT });
let clients = new Set();

wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('Client connected');

    ws.on('message', (msg) => {
        console.log(`Received: ${msg}`);

        // Special case: Ping/Pong
        if (msg == "ping") {
            ws.send(JSON.stringify({ response: "pong" }));
            return;
        }

        // Try to parse the message as JSON
        let parsed;
        try {
            parsed = JSON.parse(msg);
        } catch (e) {
            parsed = { raw: msg }; // fallback if message is not valid JSON
        }

        // Forward to all connected clients
        clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(
                    JSON.stringify({
                        sender: client === ws ? "[SERVER]" : "[CLIENT]",
                        ...parsed
                    })
                );
            }
        });
    });

    ws.on('close', () => {
        clients.delete(ws);
        console.log('Client disconnected');
    });
});

console.log('WebSocket server running on ws://localhost:8080');