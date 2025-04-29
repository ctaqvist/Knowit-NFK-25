import express from 'express';
import dotenv from 'dotenv';
import jwt from "jsonwebtoken";
import databaseQueries from '../../database/databaseQueries.js';

dotenv.config();
const router = express.Router();


router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Input validation
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        if(username === process.env.USER && password === process.env.PASS) {
            const token = jwt.sign(
                { 
                    username: username,
                },
                process.env.SECRET_KEY, 
                { expiresIn: '6h' }
            );
            return res.status(200).json({ token });
        }

        const user = await databaseQueries.getUserByUsername(username);
        
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // TODO: Implement proper password hashing
        if (username === user.username && password === user.password) {
            const token = jwt.sign(
                { 
                    userId: user.userId,
                    role: user.roleName
                },
                process.env.SECRET_KEY, 
                { expiresIn: '6h' }
            );
            return res.status(200).json({ token });
        } else {
            return res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: "Internal server error" });
    }
});


export default router;