import jwt from 'jsonwebtoken'
function authCheck(req, res, next){
    const token = req.header('A')
    const verification = jwt.verify(token, SECRET_KEY)
    if(verification){
        next
    }
    else{
        res
    }
}