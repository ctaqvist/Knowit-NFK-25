import expressApp from "./router.js";
import initializeWebSocketServer from "./websocketServer.js";
import http from "http";
import startStreamingServer from "./streamingServer.js";

const httpPort = 80;
const server = http.createServer(expressApp);
server.listen(httpPort, () => {
    console.log(`HTTP server is running on port ${httpPort}`);
});

initializeWebSocketServer(server);
startStreamingServer({
    inputPort: 1234,
    outputPort: 9000
}); 