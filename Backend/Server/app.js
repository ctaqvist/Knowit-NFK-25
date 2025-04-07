import app from "./router.js";
import startWebSocketServer from "./websocketServer.js";
import http from "http";

// This is the root file
const PORT = 8080;

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`HTTP server is running on port ${PORT}`);
});

startWebSocketServer(server);