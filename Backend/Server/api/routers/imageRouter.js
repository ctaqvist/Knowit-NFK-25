import express from 'express';
import authCheck from "../authentication/routeAuthMiddleware.js";
import path from 'path'
import { fileURLToPath } from 'url';
import fs from 'fs';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imagesStaticPath = path.join(__dirname, "../../img");
const baseURL = 'https://terrax9.se/images/';

router.use(authCheck);

router.get('/', (req, res) => {
    // Fetch a list of images
    fs.readdir(imagesStaticPath, (err, files) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error while getting images.")
        }

        // Create url of each image
        const urls = files.map(imgName => {
            return new URL(imgName, baseURL);
        })
        return res.send(urls);
    });
});

router.get('/:imageName', (req, res) => {
    const { imageName } = req.params;
    const filePath = path.join(imagesStaticPath, imageName);

    // Check if the file path exist
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error("File not found:", imageName);
            return res.status(404).send("Image not found.");
        }
        return res.sendFile(filePath);
    });
});

export default router;