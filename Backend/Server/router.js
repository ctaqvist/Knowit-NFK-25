import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
import fs from 'fs'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const expressApp = express()

const imageStaticPath = path.join(__dirname, "img")
const baseURL = 'http://test.lazyloops.se/img/'
expressApp.use('/img', express.static(imageStaticPath)) // access the images 

expressApp.get('/images', (req, res) => {
    fs.readdir(imageStaticPath, (err, files) => { //fetch a list of images
        if(err){
            console.error(err);
            res.status(500).send("error while getting images")
        }
        const urls = files.map(imgName => { //create url of each image
            return new URL(imgName, baseURL)
        })
        res.send(urls)
    })
})

expressApp.get('/', (req, res) => {
    res.status(200).json({ message: "Hello, world!" })
})


export default expressApp