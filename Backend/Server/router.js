import express from 'express'
import path from 'path'


const app = express()

app.use('/img', express.static(path.join(__dirname, "img"))) // access the images 

app.get('/', (req, res) => {
    res.status(200).json({ message: "Hello, world!" })
})


export default app