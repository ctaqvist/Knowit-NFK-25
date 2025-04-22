import jwt from 'jsonwebtoken'

function authCheck(SECRET_KEY){
    // The authCheck returns a middleware
    return (req, res, next) => {
    // The token should be included as a query to the url
    const token = req.query.token;
    if(!token) return res.status(401).json({ message : "Access denied!" });
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        // Add userId to the request
        req.userId = token.userId;
        next()
    }
    catch (error) {
        res.status(401).json({message : "Invalid token!"})
    }
}
}

export default authCheck