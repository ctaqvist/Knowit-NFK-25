import sqlite3 from 'sqlite3';
import path from 'path';
import { exit } from 'process';
import { fileURLToPath } from 'url';


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

const createTableQuery = `
    CREATE TABLE IF NOT EXISTS role (
        roleId INTEGER PRIMARY KEY AUTOINCREMENT,
        role TEXT UNIQUE
    );

    CREATE TABLE IF NOT EXISTS user (
        userId INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        email TEXT UNIQUE,
        roleId INTEGER,
        FOREIGN KEY (roleId) REFERENCES role(roleId)
    );

    CREATE TABLE IF NOT EXISTS rover (
        roverId INTEGER PRIMARY KEY AUTOINCREMENT,
        rover_serial TEXT UNIQUE
    );

    CREATE TABLE IF NOT EXISTS userRover (
        userRoverId INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        roverId INTEGER,
        FOREIGN KEY (userId) REFERENCES user(userId),
        FOREIGN KEY (roverId) REFERENCES rover(roverId)
    );

    INSERT OR IGNORE INTO role (role) VALUES ('admin'), ('user');
    INSERT OR IGNORE INTO user (userId, username, password, email, roleId) VALUES (1, 'admin', '1234', 'admin@terrax9.se', 1);
    INSERT OR IGNORE INTO rover (roverId, rover_serial) VALUES (1, 'rover-001');
    INSERT OR IGNORE INTO userRover (userRoverId, userId, roverId) VALUES (1, 1, 1);
`;

function createTables() {
    db.exec(createTableQuery, (err) => {
        if (err) {
            console.error('Error creating tables:', err);
        } else {
            console.log('Tables are ready!');
        }
    });
}

export default db;
