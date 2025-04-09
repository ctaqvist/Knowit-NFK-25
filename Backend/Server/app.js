import expressApp from "./router.js";
import initializeWebSocketServer from "./websocketServer.js";
import http from "http";


const httpPort = 8080;
const server = http.createServer(expressApp);
server.listen(httpPort, () => {
    console.log(`HTTP server is running on port ${httpPort}`);
});

initializeWebSocketServer(server);