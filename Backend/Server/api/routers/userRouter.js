import express from 'express';
import dotenv from 'dotenv';
import jwt from "jsonwebtoken"

dotenv.config();
const router = express.Router();

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);
    if (username === process.env.USER && password === process.env.PASS) {
        const token = jwt.sign({ username: username }, process.env.SECRET_KEY, { expiresIn: '6h' })
        return res.status(200).json({ token })
    }
    else {
        return res.status(401).json({ message: "Wrong username  or password." })
    }
});

export default router;