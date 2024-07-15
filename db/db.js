const { Pool } = require('pg');
require('dotenv').config();


let pool;

function createPool() {
  return new Pool({
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    port: process.env.DB_PORT,
    database: process.env.DATABASE,
    ssl: {
      rejectUnauthorized: true,
      ca: process.env.PGSSLCERT,
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



