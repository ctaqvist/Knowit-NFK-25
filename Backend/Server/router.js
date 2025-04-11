import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const expressApp = express()

const imagesStaticPath = path.join(__dirname, "img")
const baseURL = 'http://test.lazyloops.se/images/'

expressApp.get('/images', (req, res) => {
    // Fetch a list of images
    fs.readdir(imagesStaticPath, (err, files) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error while getting images")
        }
        // Create url of each image
        const urls = files.map(imgName => {
            return new URL(imgName, baseURL);
        })
        res.send(urls);
    })
})

expressApp.get('/images/:imageName', (req, res) => {
    const { imageName } = req.params
    const filePath = path.join(imagesStaticPath, imageName);
    // Check if the file path exist
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error("File not found:", imageName);
            return res.status(404).send("Image not found");
        }
        res.sendFile(filePath);
    });
})
expressApp.get('/', (req, res) => {
    res.status(200).json({ message: "Hello, world!" })
})


export default expressApp