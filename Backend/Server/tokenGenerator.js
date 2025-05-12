import jwt from 'jsonwebtoken'
import databaseQueries from '../Server/database/databaseQueries.js'
import dotenv from 'dotenv'
dotenv.config()

export async function createTokenForUser(username) {
    const user = await databaseQueries.getUserByUsername(username)
    if (!user) {
        throw new Error('User not found')
    }
    const token = jwt.sign(
        { 
            userId: user.userId,
            role: user.roleName
        },
        process.env.SECRET_KEY
    );
    return token;
}

export async function createTokenForRover(roverSerial) {
    const rover = await databaseQueries.getRoverByRoverSerial(roverSerial)
    const token = jwt.sign({ 
        roverId: rover.roverId,
        roverSerial: rover.rover_serial,
    },
        process.env.SECRET_KEY
    );
    return token;
}


