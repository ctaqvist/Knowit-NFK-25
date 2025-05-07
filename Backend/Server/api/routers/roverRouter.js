import express from 'express';
import authCheck from "../authentication/routeAuthMiddleware.js";
import databaseQueries from '../../database/databaseQueries.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/rover/login', async (req, res) => {
    try {
        const { roverSerial, password } = req.body;
        // Input validation
        if (!roverSerial || !password) {
            return res.status(400).json({ message: "Rover ID and password are required" });
        }

        const rover = await databaseQueries.getRoverByRoverSerial(roverSerial);
        console.log('rover_serial is: ', rover.rover_serial)
        if (!rover) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (roverSerial === rover.rover_serial && password === rover.password) {
            const token = jwt.sign(
                { 
                    roverId: rover.roverId,
                    roverSerial: rover.rover_serial,
                },
                process.env.SECRET_KEY,
                { expiresIn: '6h' }
            );
            return res.status(200).json({ token });
        } else {
            return res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
});

// Get all rovers for a user
router.get('/userrovers', authCheck, (req, res) => {
    const userId = req.userId;
    console.log(userId)
    databaseQueries.getUserRovers(userId, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

export default router;