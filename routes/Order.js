const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();


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


const createOrdersTableQuery = `
CREATE TABLE IF NOT EXISTS Orders (
    order_id SERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    product_code VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    qty INT,
    agent_code VARCHAR(255),
    total NUMERIC,
    status VARCHAR(255),
    FOREIGN KEY (product_code) REFERENCES Products(product_code),
    FOREIGN KEY (agent_code) REFERENCES Agents(agent_code)
);`;


const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  
    const today = new Date();
    const currentMonth = monthNames[today.getMonth()];
    const lastMonth = monthNames[(today.getMonth() - 1)];
    const lastDay = new Date(today.getFullYear(), today.getMonth(), 0).getDate();

    const firstDate = today.getFullYear() + "-" + (today.getMonth() < 10 ?  "0" + today.getMonth() : today.getMonth()) + "-01"
    const lastDate = today.getFullYear() + "-" + (today.getMonth() < 10 ?  "0" + today.getMonth() : today.getMonth()) + "-" +lastDay


pool.query(createOrdersTableQuery, (err, result) => {
    if (err) {
        console.error('Error creating Orders table:', err);
    } else {
        console.log('Orders table created or already exists');
    }
});

router.get('/', async (req, res) => {
    try {
        const query = 'SELECT * FROM Orders';
        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (err) {
        res.status(500).send('Data Load Failed: ' + err.message);
    }
});


router.get('/last', async (req, res) => {
    try {
        const query = `SELECT * FROM Orders WHERE date >= $1 AND date <= $2;`;
        const { rows } = await pool.query(query, [firstDate,lastDate]);
        res.json(rows);
    } catch (err) {
        res.status(500).send('Data Load Failed: ' + err.message);
    }
});

module.exports = router;