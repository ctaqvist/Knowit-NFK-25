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
        // Connect to server
        const ws = new WebSocket(`ws://localhost:8080/?token="bad-and-stupid-token"`);

        // The connection should close immideatly
        ws.on('close', (code) => {
            expect(code).toBe(4001);
            done();
        });
    });

    it('test send pic, server should save image', (done) => {

    });
});