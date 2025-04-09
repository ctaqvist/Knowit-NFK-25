import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const expressApp = express()

expressApp.use('/img', express.static(path.join(__dirname, "img"))) // access the images 

expressApp.get('/', (req, res) => {
    res.status(200).json({ message: "Hello, world!" })
})


export default expressApp