const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();
const db = require('../db/db')


const createCustomersTableQuery = `CREATE TABLE IF NOT EXISTS customer ( 
  "customer_id" VARCHAR(255) NOT NULL,
  "first_name" VARCHAR(255) NOT NULL,
  "last_name" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) NULL,
  "phone_number" VARCHAR(255) NULL,
  "address_line_1" VARCHAR(255) NULL,
  "address_line_2" VARCHAR(255) NULL,
  "city" VARCHAR(255) NULL,
  "state" VARCHAR(255) NULL,
  "postal_code" VARCHAR(255) NULL,
  "country" VARCHAR(255) NULL
);
`;

const pool = db.getPool();
pool.connect()
pool.query(createCustomersTableQuery, (err, result) => {
    if (err) {
        console.error('Error creating Customers table:', err);
    } else {
        console.log('Customers table created or already exists');
    }
});

router.use(express.json());
router.use(cors());

router.get('/', async (req, res) => {
    try {
        const query = 'SELECT * FROM customer';
        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (err) {
        res.status(500).send('Data Load Failed: ' + err.message);
    }
});


router.get('/search', async (req, res) => {

    try {
        const customer_id = req.query.customer_id;
        const query = 'SELECT * FROM "public"."customer" WHERE customer_id = $1';
        const { rows } = await pool.query(query, [customer_id]);
        res.json({ message: `Customer ${customer_id} Search Success`, result: rows });
    } catch (err) {
        res.status(500).send(`Customer ${req.query.customer_id} Search Failed: ${err.message}`);
    }
});
module.exports = router;
