import SetUpRestAPI from "./router.js";
import startWebSocketServer from "./websocketServer.js";

// This is the root file
const PORT = 8080;
SetUpRestAPI(PORT);
startWebSocketServer(9000);