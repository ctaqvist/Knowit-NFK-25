
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

// This middleware checks whether the client is allowed to connect to web sockets on the server
function wsAuthCheck(req) {
    // Create a url with connection request 
    const url = new URL(req.url, `http://${req.headers.host}`);
    // Get the token value in the request
    const token = url.searchParams.get('token');
    if (!token) {
        // This is only for development
        return {
            username: "admin"
        };

        //XXX: Fix for production
        throw new Error('No token is provided!');
    }
    return jwt.verify(token, SECRET_KEY);
}

export default wsAuthCheck