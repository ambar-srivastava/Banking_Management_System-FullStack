const { Pool } = require('pg');
require('dotenv').config();

let connectionString = process.env.DATABASE_URL;

if (process.env.NODE_ENV === 'test' && connectionString) {
    const dbUrl = new URL(connectionString);
    dbUrl.pathname = '/banking_system_test';
    connectionString = dbUrl.toString();
}

const pool = new Pool({
    connectionString,
})

module.exports = pool;