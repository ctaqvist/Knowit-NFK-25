import { WebSocketServer } from 'ws';
import { WebSocket } from 'ws';
import saveImage from './helpers/saveImageFromRawData.js';
import wsAuthCheck from './helpers/webSocketAuthMiddleware.js';
import { sendPong, forwardMessageToAllClients, parseJsonMessage, containsImageData, forwardMessageToTargetClient, connectToRover, removeConnectionFromUserRoverDict, disconnectFromRover } from './helpers/utils.js';
import dotenv from 'dotenv';

// This dictionary will contain the userId and the roverId which the user is connected to
let USER_ROVER_DICT = {};

dotenv.config()
const SECRET_KEY = process.env.SECRET_KEY;

function initializeWebSocketServer(server) {
    const wss = new WebSocketServer({ server });
    let clients = new Set();

    // Set up server
    wss.on('connection', (ws, req) => {
        onConnection(ws, req);
        ws.on('message', (msg) => {
            onMessage(msg, ws);
        })
        ws.on('close', () => {
            console.log( "token is: ", ws.token);
            if (ws.token) {
                console.log(`${ws.token} disconnected`);
            } else {
                console.log("A user disconnected.")
            }
            removeConnectionFromUserRoverDict(ws, USER_ROVER_DICT, clients);
            clients.delete(ws);
        });
    })

    // Handelers and events
    function onMessage(msg, ws) {
        // Log client and it's message
        console.log(`[Message]: ${msg}`)

        // Special ping/pong case
        if (msg == "ping") {
            sendPong(ws);
            return;
        }

        // Message will be an object
        const message = parseJsonMessage(msg);

        // Check if the message is a connect command and client is a user
        if (message.command === "connect" && ws.token.userId) {
            connectToRover(message, USER_ROVER_DICT, ws, clients);
            return;
        }

        // Check if the message is a disconnect command and client is a user
        if(message.command === "disconnect" && ws.token.userId) {
            disconnectFromRover(ws, message, USER_ROVER_DICT);
            return;
        }

        // Check if the message is containing image-data
        if (containsImageData(message)) {
            saveImage(message.image_base64);
            return;
        }

        // Forward message to all clients
        forwardMessageToTargetClient(message, clients, ws, USER_ROVER_DICT);
    }

    function onConnection(ws, req) {
        console.log("Client connects to server")
        try {
            const decoded = wsAuthCheck(req, SECRET_KEY);
            // Attach the token to the ws 
            ws.token = decoded;
            console.log("Token is: ", ws.token)
            if(decoded.username) {
                console.log(`${decoded.username} is connected to web socket!`)
            }
            else if (decoded.roverId) {
                console.log(`${decoded.roverSerial} is connected to web socket!`)
            }
            ws.send(JSON.stringify({
            response: "success",
            message: "You are connected to the server!"
            }));
        }
        catch {
            // Close the connection if token is invalid
            ws.close(4001, 'Invalid token!')
            return
        }

        console.log('A new client just connected.');
        clients.add(ws);
    }

    return wss
}

export function getUserRoverDict() {
    return USER_ROVER_DICT;
}

export default initializeWebSocketServer