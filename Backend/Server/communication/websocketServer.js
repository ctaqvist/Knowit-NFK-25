import { WebSocketServer } from 'ws';
import { WebSocket } from 'ws';
import saveImage from '../api/helpers/saveImageFromRawData.js';
import wsAuthCheck from './webSocketAuthMiddleware.js';

const SECRET_KEY = "HiThisIsSecretKey";

function initializeWebSocketServer(server) {
    const wss = new WebSocketServer({ server });
    let clients = new Set();

    wss.on('connection', (ws, req) => {
        try{
            const decoded = wsAuthCheck(req, SECRET_KEY);
            // Attach the token to the ws 
            ws.token = decoded
            console.log(`${decoded.username} is connected to web socket!`)
        }
        catch{
            // Close the connection if token is invalid
            ws.close(4001, 'Invalid token!')
            return
        }

        console.log('A new client just connected.');
        clients.add(ws);

        ws.on('message', (msg) => {
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
            forwardMessageToAllClients(message, clients, ws)
        })

        ws.on('close', () => {
            console.log(`${ws.token.username} disconnected`);
            clients.delete(ws);
        })
    })

    // Client is passed as paramter
    function sendPong(ws) {
        ws.send(JSON.stringify({ response: "pong" }));
    }

    //Send message to all clients, if client is sender, recieves server:obj else client : obj
    function forwardMessageToAllClients(parsed, clients, ws) {
        clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    sender: client === ws ? '[SERVER]' : '[CLIENT]', ...parsed
                }))
            }
        })
    }

    //Parse json
    function parseJsonMessage(message) {
        try {
            const parsed = JSON.parse(message);
            return parsed
        }
        catch (err) {
            console.warn("Message isn't valid JSON. Parsing as raw...")
            const parsed = { raw: message.toString() }
            return parsed
        }
    }

    function containsImageData(parsed) {
        const expectedValues = {
            rover_id: "rover-001",
            sender: "[CLIENT]",
            response: "picture_data"
        };

        return parsed.sender === expectedValues.sender &&
            parsed.rover_id === expectedValues.rover_id &&
            parsed.response === expectedValues.response &&
            Boolean(parsed.image_base64);
    }

    return wss
}

export default initializeWebSocketServer