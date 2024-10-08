const { Pool } = require('pg');
require('dotenv').config();


let pool;

function createPool() {
  return new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    idleTimeoutMillis: 10000,
    ssl: {
      rejectUnauthorized: true,
      // ca: process.env.DB_SSL_ROOT_CERT,
    },
  });
}

module.exports = {
  getPool() {
    if (!pool) {
      pool = createPool();
    }
    return pool;
  },
};



