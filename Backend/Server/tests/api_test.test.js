import request from 'supertest';
import expressApp from '../api/app.js';
import dotenv from 'dotenv';
import WebSocket from 'ws';
import fs from 'fs';
import path from 'path';
import initializeWebSocketServer from '../communication/websocketServer.js';
import http from "http";
import {createTokenForUser} from '../tokenGenerator.js'


// Helper for image test
function getMostRecentImageBase64() {
    const imgDir = path.resolve('./img');
    const files = fs.readdirSync(imgDir)
        .filter(file => file.endsWith('.jpg'))
        .map(file => ({
            file,
            time: fs.statSync(path.join(imgDir, file)).mtime.getTime()
        }))
        .sort((a, b) => b.time - a.time); // Newest first

    if (files.length === 0) {
        throw new Error('No images found.');
    }

    const mostRecentFilePath = path.join(imgDir, files[0].file);
    const fileBuffer = fs.readFileSync(mostRecentFilePath);
    const base64String = fileBuffer.toString('base64');

    return base64String;
}

describe('Terrax9 API', () => {
    it('should respond with Hello World message on /', async () => {
        const response = await request(expressApp).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe("Hello World! This is the Terrax9 API! :)");
    });

    it('should block access to /images with bad token', async () => {
        const response = await request(expressApp).get('/images?token=badtoken');
        expect(response.statusCode).toBe(401);
    });

    it('test login with hardcoded credentials', async () => {
        const response = await request(expressApp).post('/login').send({
            username: process.env.USER, password: process.env.PASS
        });
        expect(response.statusCode).toBe(200);
    });

    it('test login with bad credentials', async () => {
        const response = await request(expressApp).post('/login').send({
            username: "badusername", password: "badpassword"
        });
        expect(response.statusCode).toBe(401);
    });

    it('test rover login', async () => {
        const response = await request(expressApp).post('/rover/login').send({
            roverSerial: "rover-001", password: "1234"
        });
        expect(response.statusCode).toBe(200);
    });

    it('get rovers of user', async () => {
        const token = await createTokenForUser('admin');
        const response = await request(expressApp).get(`/userrovers?token=${token}`);
        expect(response.statusCode).toBe(200);
        
        expect(Array.isArray(response.body)).toBe(true);

        if(response.body.length > 0) {
            const rover = response.body[0];
            console.log(rover);
            expect(rover).toHaveProperty('userRoverId');
            expect(rover).toHaveProperty('userId');
            expect(rover).toHaveProperty('roverId');
        }
    });
});

// For this to work, port 8080 must be available.
const httpPort = 8080;
const server = http.createServer();
const websocketServer = initializeWebSocketServer(server);
server.listen(httpPort);

describe('Terrax9 communication test', () => {
    afterAll((done) => {
        server.close(() => {
            websocketServer.close(() => {
                done();
            });
        });
    });

    it('test connect with bad token', (done) => {
        // Connect to server
        const ws = new WebSocket(`ws://localhost:8080/?token=bad-and-stupid-token`);

        ws.on('error', (err) => {
            // We expect some error if connection is rejected
            console.log('Connection error as expected:', err.message);
            fail('WebSocket error event was triggered, which should not happen if "close" is expected');
            ws.close();
            done();
        });

        ws.on('close', (code) => {
            expect(code).toBe(4001); // Server should reject with 4001
            done();
        });
    });

    it('test send pic, server should save image', (done) => {
        // Connect to server
        const client = new WebSocket(`ws://localhost:8080`);

        const imageData = "nonesenseimageforaverycooltest:)";
        const imagebase64 = Buffer.from(imageData).toString('base64')

        // Send a nonsense picture, this is usually from the rover.
        client.on('open', () => {
            client.send(
                // This is the command to upload an image
                `{"response":"picture_data", "image_base64": "${imagebase64}", "sender": "[ROVER]"}`
            );

            // Delay to ensure server saves image
            setTimeout(() => {
                // Get the most recent image, convert it back to base64 and compare to the original. Should be the same.
                const lastImage = getMostRecentImageBase64();
                expect(lastImage).toBe(imagebase64);
                client.close();
                done();
            }, 100);
        });

        client.on('error', (error) => {
            console.error('WebSocket error:', error);
            client.close();
            done(error);
        });
    });
});

describe('api test again', () => {
    it('get all a list images and test to get every single one', async () => {
        const response = await request(expressApp).get('/images');
        expect(response.statusCode).toBe(200);
        expect(response.body !== undefined).toBe(true);
        
        for (const url of response.body) {
            const imageId = url.split('/images/')[1];
            const singleResponse = await request(expressApp).get(`/images/${imageId}`);
            expect(singleResponse.statusCode).toBe(200);
        }
    });
});

