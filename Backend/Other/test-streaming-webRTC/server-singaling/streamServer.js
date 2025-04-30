const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });

let viewer = null;
let streamer = null;

wss.on("connection", ws => {
  ws.on("message", message => {
    const data = JSON.parse(message);

    if (data.type === "streamer") {
      streamer = ws;
    } else if (data.type === "viewer") {
      viewer = ws;
    }

    // Relay signaling messages
    if (ws === viewer && streamer) {
      streamer.send(JSON.stringify(data));
    } else if (ws === streamer && viewer) {
      viewer.send(JSON.stringify(data));
    }
  });

  ws.on("close", () => {
    if (ws === streamer) streamer = null;
    if (ws === viewer) viewer = null;
  });
});

console.log("WebRTC signaling server running on ws://localhost:8080");