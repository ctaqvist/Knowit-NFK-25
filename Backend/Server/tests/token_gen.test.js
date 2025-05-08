import { createTokenForUser, createTokenForRover } from '../tokenGenerator.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import request from 'supertest';

dotenv.config();

describe('createTokenForUser', () => {
    it('should generate a token with userId and role for a valid username', async () => {
        const username = 'admin';
        const token = await createTokenForUser(username);
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        expect(decoded).toHaveProperty('userId');
        expect(decoded).toHaveProperty('role');
    });
});

describe('createTokenForRover', () => {
    it('should generate a token with roverId and roverSerial for a valid roverSerial', async () => {
        const roverSerial = 'rover-001';
        const token = await createTokenForRover(roverSerial);
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        expect(decoded).toHaveProperty('roverId');
        expect(decoded).toHaveProperty('roverSerial');
    });
});

// NOTE: This is hardcoded test and may fail if current DB setup changes. In that case feel free to remove it.
import expressApp from '../api/app.js';

describe('login', () => {
    it('test login with hardcoded login u: admin and p: 1234', async () => {
        const response = await request(expressApp).post('/login').send({
            username: "user", password: "1234"
        });

        console.log(response.body);

        expect(response.statusCode).toBe(200);
        expect(response.body.token === undefined).toBe(false);
        // Test to authenticate with token
        console.log("BOBOBAGONOSH")
        const response2 = await request(expressApp).get(`/auth?token=${response.body.token}`)
        expect(response2.statusCode).toBe(200);


    });
})