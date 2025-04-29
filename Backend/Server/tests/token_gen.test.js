import { createTokenForUser, createTokenForRover } from '../tokenGenerator.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
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