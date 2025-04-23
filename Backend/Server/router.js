import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
import fs from 'fs'
import jwt from 'jsonwebtoken'
import authCheck from './jwtMiddleware.js';
import bodyParser from 'body-parser'

const USER = "test"
const PASS = "test"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const expressApp = express()

// This is needed for form POSTs
expressApp.use(bodyParser.urlencoded({ extended: true })); 
// This is for JSON data
expressApp.use(bodyParser.json()); 

const imagesStaticPath = path.join(__dirname, "img")
const baseURL = 'http://test.lazyloops.se/images/'

const SECRET_KEY = "HiThisIsSecretKey"

// Middleware authCheck checks if the user has right to visit this route
expressApp.get('/images', authCheck(SECRET_KEY), (req, res) => {
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

expressApp.post('/login', (req, res) => {
    const {username, password} = req.body;
    console.log(username, password)
    if(username === USER && password === PASS){
        const token = jwt.sign({username: username}, SECRET_KEY, {expiresIn: '6h'})
        return res.json({ token })
    }
    else
    {   
        console.log("access denied")
        res.status(500).json({message : "Wrong user/password"})        
    }
})

expressApp.get('/', (req, res) => {
    res.status(200).json({ message: "Hello World!" })
})


export default expressApp