import { WebSocketServer } from 'ws';
import { WebSocket } from 'ws';
import jwt from 'jsonwebtoken'

function wsAuthCheck(ws, req){
    // Create a url with connection request 
    const url = new URL(req.url, `http://${req.headers.host}`);
    // Get the token value in the request
    const token = url.searchParams.get('token');
    try{
        const decoded = jwt.verify(token, SECRET_KEY)
        // Attach the token to the ws 
        ws.token = decoded
        console.log(`${decoded.username} is connected to web socket!`)
    }
    catch{
        // Close the connection if token is invalid
        ws.close(4001, 'Invalid token!')
        return
    }
}
export default wsAuthCheck