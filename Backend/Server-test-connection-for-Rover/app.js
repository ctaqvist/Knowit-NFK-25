const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
let clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log('Client connected');

  ws.on('message', (msg) => {
    console.log(`Received: ${msg}`);

    // Forward to all other clients
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        if (client === ws) {
          client.send(`[Server echoes back]: ${msg}`)
        } else {
          client.send(msg);
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