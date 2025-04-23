import jwt from 'jsonwebtoken'

const SECRET_KEY = "HiThisIsSecretKey"
// Token with infinite lifespan 
const token = jwt.sign({}, SECRET_KEY)
console.log(token)

// This is the token
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NDU0MDAwOTJ9.Afp7bmRont-WP2rGang2A7sTrc2mN2KZTyU3XjySl5k