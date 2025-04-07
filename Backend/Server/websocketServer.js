import { WebSocketServer } from 'ws';
import { WebSocket } from 'ws';

function startWebSocketServer(PORT){
    const wss = new WebSocketServer({ port: PORT});
    let clients = new Set();

    wss.on('connection', (ws) => {
        console.log('client is connected!');
        clients.add(ws);

        ws.on('message', (msg) => { //Get message from a client

            if(respondPong(msg, ws)){ return }

            const parsed = parseMessage(msg);

            clients.forEach((client) => {
                sendMessage(parsed, client, ws)
            })
        })

        ws.on('close', () => {
            clients.delete(ws);
            console.log('client disconnected')
        })
    })

    function respondPong(message, ws){ //special case, response pong
        if(message === "ping"){
            ws.send(JSON.stringify({response : "pong"}));
            return true
        }
        return false
    }

    function sendMessage(parsed, client, ws){ //Send message to all clients, if client is sender, recieves server:obj else client : obj
        if(client.readyStatus === WebSocket.OPEN){
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
    return wss
}

export default startWebSocketServer