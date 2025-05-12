import sqlite3 from 'sqlite3';
import path from 'path';
import { exit } from 'process';
import { fileURLToPath } from 'url';
import { SQL_QUERIES } from './queryLoader.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const databasePath = path.join(__dirname, 'database.db');

const db = new sqlite3.Database(databasePath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Failed to open or create the database:', err);
        exit(1);
    } else {
        console.log('Connected to the database!');
        createTables();
    }
});

function createTables() {
    db.exec(SQL_QUERIES.createTables + '\n' + SQL_QUERIES.insertInitialData, (err) => {
        if (err) {
            console.error('Error creating tables:', err);
        } else {
            console.log('Tables are ready!');
        }
    });
}

export default db;
