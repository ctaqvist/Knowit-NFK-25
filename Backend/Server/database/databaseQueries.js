import db from './initializeDatabase.js'
import { SQL_QUERIES } from './queryLoader.js';

// Get all rovers belongs to a user
function getUserRovers(userId, callback) {
    db.all(SQL_QUERIES.getUserRovers, [userId], callback);
}

function getUserByUsername(username) {
    return new Promise((resolve, reject) => {
        db.get(SQL_QUERIES.getUserByUsername, [username], (err, row) => {
            if (err) {
                console.error('Database error:', err);
                reject(err);
            }
            resolve(row || null);
        });
    });
}

function getRoverByRoverSerial(roverSerial) {
    return new Promise((resolve, reject) => {
        db.get(SQL_QUERIES.getRoverByRoverSerial, [roverSerial], (err, row) => {
            if (err) {
                console.error('Database error:', err);
                reject(err);
            }
            resolve(row || null);
        });
    });
}

export default { getUserRovers, getUserByUsername, getRoverByRoverSerial };
