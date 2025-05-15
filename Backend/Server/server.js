import expressApp from "./api/app.js"
import initializeWebSocketServer from "./communication/websocketServer.js"
import startStreamingServer from "./streaming/streamingServer.js";
import http from "http";

// Create node server based on express
const httpPort = 8081;
const server = http.createServer(expressApp);
server.listen(httpPort, () => {
    console.log(`HTTP server is running on port ${httpPort}`);
});

// Initialize websocket for server
initializeWebSocketServer(server);

// Create and start stream server (note this is independant on the server above)
startStreamingServer({
    inputPort: 1235,
    outputPort: 9001
});