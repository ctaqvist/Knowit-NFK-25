const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
let clients = new Set();

wss.on('connection', (ws) => {
    clients.add(ws);
    console.log('Client connected');

    ws.on('message', (msg) => {
        console.log(`Received: ${msg}`);

        // Special case: Ping/Pong
        if (msg == "ping") {
            ws.send(`{"response": "pong"}`);
            return;
        }

        // Forward to all other clients
        clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                if (client === ws) {
                    client.send(
                        JSON.stringify({
                                "sender": "[SERVER]",
                                "response": msg
                            })
                    )
                } else {
                    client.send(
                        JSON.stringify({
                            "sender": "[CLIENT]",
                            "response": msg
                        })
                    );
                }
            }
        });
    });

    ws.on('close', () => {
        clients.delete(ws);
        console.log('Client disconnected');
    });
});

console.log('WebSocket server running on ws://localhost:8080');