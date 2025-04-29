import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

// This middleware checks whether a user is authorized to access a route on the server.
function authCheck(req, res, next) {
    // The token should be included as a query to the url
    const token = req.query.token;
        
    // If no token exists, deny access
    if (!token) {
        // XXX: CHANGE DURING PRODUCTION -- during development, if no token is provided, allow access anyway
        next();
        return;
        // return res.status(401).json({ message: "Access denied!" });
    }

    try {
        // Try to verify token
        jwt.verify(token, SECRET_KEY);

        // Add userId to the request
        req.userId = token.userId;
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Invalid token!" });
    }
}

export default authCheck