import jwt from 'jsonwebtoken'

// This is where you can create tokens 

const SECRET_KEY = "HiThisIsSecretKey"

// Token with infinite lifespan 
const token = jwt.sign({}, SECRET_KEY)
console.log(token)

// This is a token with unlimited lifetime can be used for development
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NDU0MDAwOTJ9.Afp7bmRont-WP2rGang2A7sTrc2mN2KZTyU3XjySl5k