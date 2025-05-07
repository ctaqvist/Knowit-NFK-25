import express from 'express';
import dotenv from 'dotenv';
import jwt from "jsonwebtoken";
import databaseQueries from '../../database/databaseQueries.js';
import authCheck from '../authentication/routeAuthMiddleware.js';

dotenv.config();
const router = express.Router();


router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Input validation
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        // Special case for superadmin
        if (username === process.env.USER && password === process.env.PASS) {
            const token = jwt.sign(
                {
                    username: username,
                },
                process.env.SECRET_KEY,
                { expiresIn: '6h' }
            );
            return res.status(200).json({ token });
        }

        // Get user
        const user = await databaseQueries.getUserByUsername(username);
        console.log("RESPONSE USER: " + user);
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Make sure user has relevant fields
        if (!user.userId || !user.roleName) {
            return res.status(500).json({ message: "User is corrupted." });
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

// Route to check whether user's authentication token is valid.
router.get('/auth', authCheck, (res, req) => {
    // If authcheck didn't have early exit, send a success message.
    return req.status(200).json({ message: "Success" });
})

export default router;