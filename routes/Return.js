const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();
const db = require('../db/db')



const createReturnsTableQuery = `CREATE TABLE IF NOT EXISTS Returns (
    return_id SERIAL PRIMARY KEY,
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

    const thisfirstDate = today.getFullYear() + "-" + ((today.getMonth() + 1) < 10 ?  "0" + (today.getMonth() + 1) : (today.getMonth() + 1)) + "-01"
    const thislastDate = today.getFullYear() + "-" + ((today.getMonth() + 1) < 10 ?  "0" + (today.getMonth() + 1) : (today.getMonth() + 1)) + "-" +lastDay

    const firstDate = today.getFullYear() + "-" + (today.getMonth() < 10 ?  "0" + today.getMonth() : today.getMonth()) + "-01"
    const lastDate = today.getFullYear() + "-" + (today.getMonth() < 10 ?  "0" + today.getMonth() : today.getMonth()) + "-" +lastDay

    const pool = db.getPool();
    pool.connect();
pool.query(createReturnsTableQuery, (err, result) => {
    if (err) {
        console.error('Error creating Returns table:', err);
    } else {
        console.log('Returns table created or already exists');
    }
});


router.get('/', async (req, res) => {
    try {
        const query = 'SELECT * FROM Returns';
        const { rows } = await pool.query(query);
        res.setHeader('Access-Control-Allow-Origin', 'https://work-tracking-frontend-thrumming-frog-959.fly.dev');
        res.json(rows);
    } catch (err) {
        res.status(500).send('Data Load Failed: ' + err.message);
    }
});

router.get('/month', async (req, res) => {
    const customer_id = req.query.customer_id;
    try {
        const query = `SELECT * FROM Returns WHERE customer_id = $1 and date >= $2 AND date <= $3;`;
        const { rows } = await pool.query(query, [customer_id,thisfirstDate,thislastDate]);
        res.setHeader('Access-Control-Allow-Origin', 'https://work-tracking-frontend-thrumming-frog-959.fly.dev');
        res.json(rows);
    } catch (err) {
        res.status(500).send('Data Load Failed: ' + err.message);
    }
});

router.get('/last', async (req, res) => {
    const customer_id = req.query.customer_id;
    try {
        const query = `SELECT * FROM Returns WHERE customer_id = $1 and date >= $2 AND date <= $3;`;
        const { rows } = await pool.query(query, [customer_id,firstDate,lastDate]);
        res.setHeader('Access-Control-Allow-Origin', 'https://work-tracking-frontend-thrumming-frog-959.fly.dev');
        res.json(rows);
    } catch (err) {
        res.status(500).send('Data Load Failed: ' + err.message);
    }
});

router.post('/create', async (req, res) => {
    const { product_code, date, qty, customer_id, status , month} = req.body;

    try {
        const query1 = `select * From public.products where product_code = $1 and product_month = $2`

        const { rows } = await pool.query(query1,[product_code,month]);

        const query = `INSERT INTO public.Returns (product_name, product_code, date, qty, customer_id, status)
                       VALUES ($1, $2, $3, $4, $5, $6)`;
        const values = [rows[0].product_name, product_code ,date, qty, customer_id, status];
    
        const result = await pool.query(query, values);
        res.setHeader('Access-Control-Allow-Origin', 'https://work-tracking-frontend-thrumming-frog-959.fly.dev');
        res.status(200).json({ message: 'Returns Order created successfully'});
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating Returns order' });
      }
});


module.exports = router;