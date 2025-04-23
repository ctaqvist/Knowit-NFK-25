
import jwt from 'jsonwebtoken'

function wsAuthCheck(req, SECRET_KEY){
    // Create a url with connection request 
    const url = new URL(req.url, `http://${req.headers.host}`);
    // Get the token value in the request
    const token = url.searchParams.get('token');
    if(!token) throw new Error('No token is provided!');
    return jwt.verify(token, SECRET_KEY);
}
export default wsAuthCheck