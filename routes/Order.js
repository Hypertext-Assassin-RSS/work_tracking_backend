const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();
const db = require('../db/db')


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

    const thisfirstDate = today.getFullYear() + "-" + ((today.getMonth() + 1) < 10 ?  "0" + (today.getMonth() + 1) : (today.getMonth() + 1)) + "-01"
    const thislastDate = today.getFullYear() + "-" + ((today.getMonth() + 1) < 10 ?  "0" + (today.getMonth() + 1) : (today.getMonth() + 1)) + "-" +lastDay


    const firstDate = today.getFullYear() + "-" + (today.getMonth() < 10 ?  "0" + today.getMonth() : today.getMonth()) + "-01"
    const lastDate = today.getFullYear() + "-" + (today.getMonth() < 10 ?  "0" + today.getMonth() : today.getMonth()) + "-" +lastDay

    const pool = db.getPool();
    pool.connect()
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
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(rows);
    } catch (err) {
        res.status(500).send('Data Load Failed: ' + err.message);
    }
});

router.get('/month', async (req, res) => {
    const customer_id = req.query.customer_id;
    try {
        const query = `SELECT * FROM Orders WHERE customer_id = $1 and date >= $2 AND date <= $3;`;
        const { rows } = await pool.query(query, [customer_id,thisfirstDate,thislastDate]);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(rows);
    } catch (err) {
        res.status(500).send('Data Load Failed: ' + err.message);
    }
});

router.get('/last', async (req, res) => {
    const customer_id = req.query.customer_id;
    try {
        const query = `SELECT * FROM Orders WHERE customer_id = $1 and date >= $2 AND date <= $3;`;
        const { rows } = await pool.query(query, [customer_id,firstDate,lastDate]);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(rows);
    } catch (err) {
        res.status(500).send('Data Load Failed: ' + err.message);
    }
});


router.post('/create', async (req, res) => {
    const { product_code, date, qty, customer_id} = req.body;

    try {
        const query1 = `select * From public.products where product_code = $1;`
        const { rows } = await pool.query(query1,[product_code]);

        const order_id_query = 'SELECT order_id FROM orders ORDER BY order_id DESC LIMIT 1';
        const result1 = await pool.query(order_id_query);
        const lastOrderId = result1.rows[0] ? result1.rows[0].order_id : null;
        const order_id = getNextId('order',lastOrderId);

        const query = `INSERT INTO public.orders (order_id,product_name, product_code, date, qty, customer_id, status) VALUES ($1, $2, $3, $4, $5, $6,$7)`;
        const values = [order_id,rows[0].product_name, product_code ,date, qty, customer_id,'waiting'];
    
        const result = await pool.query(query, values);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).json({ message: 'Order created successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating order' });
    }
});

function getNextId(method,lastId) {
    console.log(lastId);
    if(method == 'order') {
        if (!lastId) {
            return 'ORD000001';
        } else {
            if (!lastId.startsWith('ORD') || lastId.length <= 3) {
                throw new Error('Invalid order ID format');
            } else {
                const numericPart = lastId.slice(3);

                const incrementedNumber = parseInt(numericPart, 10) + 1;
            
                const newNumericPart = incrementedNumber.toString().padStart(6, '0');
            
            
                return 'ORD' + newNumericPart;
            }
        }
    } else if (method == 'return') {
        if (!lastId) {
            return 'RET000001';
        } else {
            if (!lastId.startsWith('RET') || lastId.length <= 3) {
                throw new Error('Invalid order ID format');
            } else {
                const numericPart = lastId.slice(3);

                const incrementedNumber = parseInt(numericPart, 10) + 1;
            
                const newNumericPart = incrementedNumber.toString().padStart(6, '0');
            
            
                return 'RET' + newNumericPart;
            }
        }
    }
}

router.put('/update', async (request,response) => {
    const { product_code, date, qty,customer_id} = request.body;
    try {

        const orders_update_query = `UPDATE public.orders SET qty = $1 and date = $3  WHERE product_code = $2 and customer_id = $4`
        const orders_update_value = [qty,product_code,date,customer_id]
        const orders_update_query_result = await pool.query(orders_update_query, orders_update_value,customer_id);

        // const summary_update_query = `UPDATE public.summary SET order_qty = $1 and date = $3  WHERE product_code = $2  and customer_id = $4`
        // const summary_update_value = [qty,product_code,date,customer_id]
        // const summary_update_query_result = await pool.query(summary_update_query, summary_update_value);


        response.setHeader('Access-Control-Allow-Origin', '*');
        response.status(200).json({ message: 'successfully' , 'result':orders_update_query_result });
        
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: 'Error' , error:error});
    }

});

module.exports = router;