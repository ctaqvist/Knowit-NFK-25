import express from 'express'
import path from 'path'


const expressApp = express()

expressApp.use('/img', express.static(path.join(__dirname, "img"))) // access the images 

expressApp.get('/', (req, res) => {
    res.status(200).json({ message: "Hello, world!" })
})


export default expressApp