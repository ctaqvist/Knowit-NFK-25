import fs from 'fs';
import path from 'path';

const queriesDir = new URL('./queries/', import.meta.url);

function loadQuery(filename) {
    return fs.readFileSync(new URL(filename, queriesDir), 'utf8');
}

export const SQL_QUERIES = {
    getUserByUsername: loadQuery('getUserByUsername.sql'),
    getUserRovers: loadQuery('getUserRovers.sql'),
    createTables: loadQuery('createTables.sql'),
    insertInitialData: loadQuery('insertInitialData.sql'),
    getRoverByRoverSerial: loadQuery('getRoverByRoverSerial.sql'),
};
