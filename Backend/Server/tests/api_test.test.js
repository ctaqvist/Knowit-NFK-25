import request from 'supertest';
import expressApp from '../api/app.js';
import dotenv from 'dotenv';
import WebSocket from 'ws';

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
});

describe('Terrax9 communication test', () => {
    it('test connect with bad token', (done) => {
        const badToken = 'thisIsInvalidToken';

        // Connect to WebSocket server with token in URL
        const ws = new WebSocket(`ws://localhost:3000/?token=${badToken}`);

        ws.on('open', () => {
            console.log('Connected to WebSocket server');

            // Here depending on server logic, maybe server closes if token bad
        });

        ws.on('message', (message) => {
            console.log('Received:', message.toString());
        });

        ws.on('close', (code, reason) => {
            console.log('Connection closed:', code, reason.toString());

            // If your server closes for bad token, you can expect a close code
            expect(code).toBe(4001); // or whatever your server sends for auth failure
            done(); // Tell Jest test is done
        });

        ws.on('error', (error) => {
            console.error('WebSocket error:', error);
            done(error); // fail test if error
        });
    });
});