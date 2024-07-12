const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  
const today = new Date();

const currentMonth = monthNames[today.getMonth()];


const pool = new Pool({
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    port: process.env.PORT,
    database: process.env.DATABASE,
    ssl: {
        rejectUnauthorized: true,
        ca: process.env.PGSSLCERT,
    },
});


const createProductsTableQuery = `CREATE TABLE IF NOT EXISTS Products (
    product_code VARCHAR(255) PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    product_month VARCHAR(255),
    product_price NUMERIC
);`;

pool.query(createProductsTableQuery, (err, result) => {
    if (err) {
        console.error('Error creating Products table:', err);
    } else {
        console.log('Products table created or already exists');
    }
});


router.get('/', async (req, res) => {
    try {
        const query = 'SELECT * FROM Products';
        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (err) {
        res.status(500).send('Data Load Failed: ' + err.message);
    }
});


router.get('/month', async (req, res) => {
    try {
        const query = `select * from products where product_month = $1`;
        const { rows } = await pool.query(query, [currentMonth]);
        res.json(rows);
    } catch (err) {
        res.status(500).send('Data Load Failed: ' + err.message);
    }
});


module.exports = router;