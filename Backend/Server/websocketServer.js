import { WebSocketServer } from 'ws';
import { WebSocket } from 'ws';
import saveImage from './saveImageFromRawData.js';


function startWebSocketServer(server){
    const wss = new WebSocketServer({ server });
    let clients = new Set();

    wss.on('connection', (ws) => {
        console.log('client is connected!');
        clients.add(ws);

        ws.on('message', (msg) => { //Get message from a client

            if(msg == "ping"){
                sendPong(ws);
                return;
            }

            const parsed = parseMessage(msg);


            if (isImage(parsed)) {
                saveImage(parsed.image_base64);
            }

            clients.forEach((client) => {
                sendMessage(parsed, client, ws)
            })
        })

        ws.on('close', () => {
            clients.delete(ws);
            console.log('client disconnected')
        })
    })

    function sendPong(ws){
        ws.send(JSON.stringify({response : "pong"}));
    }

    function sendMessage(parsed, client, ws){ //Send message to all clients, if client is sender, recieves server:obj else client : obj
        if(client.readyState === WebSocket.OPEN){
            console.log(parsed)
            client.send(JSON.stringify({
                sender : client === ws ? '[SERVER]' : '[CLIENT]', ...parsed }))
        }
    }

    function parseMessage(message){ //parse json
        try{
            const parsed = JSON.parse(message);
            return parsed
        }
        catch (err) {
            console.log("the message cannot be parsed ", err)
            const parsed = {raw : message}
            return parsed
        }
    }

    function isImage(parsed){
        const rover_id = "rover_001" 
        const sender = "[CLIENT]" 
        const data_type = "picture_data"

        if(parsed.sender === sender && 
            parsed.rover_id === rover_id &&
            parsed.response === data_type && 
            parsed.image_base64
        ){
            return true;
        }
        return false;
    }

    return wss
}

export default startWebSocketServer