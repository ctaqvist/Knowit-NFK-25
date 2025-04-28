import expressApp from "./router.js";
import initializeWebSocketServer from "./websocketServer.js";
import http from "http";
import startStreamingServer from "./streamingServer.js";

// Create node server based on express
const httpPort = 8080;
const server = http.createServer(expressApp);
server.listen(httpPort, () => {
    console.log(`HTTP server is running on port ${httpPort}`);
});

// Initialize websocket for server
initializeWebSocketServer(server);

// Create and start stream server (note this is independant on the server above)
startStreamingServer({
    inputPort: 1234,
    outputPort: 9000
});