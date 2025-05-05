import { WebSocketServer } from 'ws';
import { WebSocket } from 'ws';
import saveImage from './helpers/saveImageFromRawData.js';
import wsAuthCheck from './helpers/webSocketAuthMiddleware.js';
import { sendPong, forwardMessageToAllClients, parseJsonMessage, containsImageData } from './helpers/utils.js';
import dotenv from 'dotenv';

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
                console.log(`${ws.token.username} disconnected`);
            } else {
                console.log("A user disconnected.")
            }
            clients.delete(ws);
        })
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

        // Check if the message is containing image-data
        if (containsImageData(message)) {
            saveImage(message.image_base64);
            return;
        }

        // Forward message to all clients
        forwardMessageToAllClients(message, clients, ws);
    }

    function onConnection(ws, req) {
        console.log("Client connects to server")
        try {
            const decoded = wsAuthCheck(req, SECRET_KEY);
            // Attach the token to the ws 
            ws.token = decoded;
            console.log(`${decoded.username} is connected to web socket!`)
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

export default initializeWebSocketServer