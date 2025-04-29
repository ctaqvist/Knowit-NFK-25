import fs from 'fs';
import path from 'path';

const queriesDir = path.join(path.dirname(new URL(import.meta.url).pathname), 'queries');

function loadQuery(filename) {
    return fs.readFileSync(path.join(queriesDir, filename), 'utf8');
}

export const SQL_QUERIES = {
    getUserByUsername: loadQuery('getUserByUsername.sql'),
    getUserRovers: loadQuery('getUserRovers.sql'),
    createTables: loadQuery('createTables.sql'),
    insertInitialData: loadQuery('insertInitialData.sql'),
    getRoverByRoverSerial: loadQuery('getRoverByRoverSerial.sql'),
};
