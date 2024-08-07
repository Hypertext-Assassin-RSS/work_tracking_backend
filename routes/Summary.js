const express = require('express')
const router = express.Router()
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();
const db = require('../db/db')

const pool = db.getPool();
pool.connect()

router.post('/create', async (request,response) => {
    const {customer_id , product_code,product_name,date,returnQty,orderQty} = request.body;

    try {
        const order_id_query = 'SELECT order_id FROM orders ORDER BY order_id DESC LIMIT 1';
        const result = await pool.query(order_id_query);
        const lastOrderId = result.rows[0] ? result.rows[0].order_id : null;
        const order_id = getNextId('order',lastOrderId);

        const return_id_query = `SELECT return_id FROM returns ORDER BY return_id DESC LIMIT 1`
        const  result1  = await pool.query(return_id_query);
        const lastReturnId = result1.rows[0] ? result1.rows[0].return_id : null;
        const return_id = getNextId('return',lastReturnId);

        const order_query = `INSERT INTO public.orders (order_id,product_name, product_code, date, qty, customer_id, status)
                        VALUES ($1, $2, $3, $4, $5, $6 ,$7)`;
        const order_values = [order_id,product_name, product_code ,date, orderQty, customer_id, 'pending'];

        const return_query = `INSERT INTO public.Returns (return_id,product_name, product_code, date, qty, customer_id, status)
                        VALUES ($1, $2, $3, $4, $5, $6 ,$7)`;
        const return_values = [return_id,product_name, product_code ,date, returnQty, customer_id, 'pending'];

        const summary_query = `INSERT INTO public.summary (customer_id, product_code,product_name,date,return_id,return_qty,order_id,order_qty)
                        VALUES ($1, $2, $3, $4, $5, $6 , $7 ,$8)`;
        const summary_values = [customer_id,product_code,product_name,date,return_id,returnQty,order_id,orderQty];

        const order_result = await pool.query(order_query, order_values);
        const return_result = await pool.query(return_query, return_values);
        const summary_result = await pool.query(summary_query, summary_values);

        response.setHeader('Access-Control-Allow-Origin', '*');
        response.status(200).json({ message: 'created successfully'});
    } catch (error) {       
        console.error(error);
        response.status(500).json({ message: 'Error creating!' });
    }
})


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
    const {  return_id,order_id,date,customer_id,orderQty,returnQty} = request.body;

    try {
        const return_update_query = `UPDATE public.Returns SET qty = $1 , date = $2 WHERE return_id = $3 and customer_id = $4`
        const return_update_value = [returnQty,date,return_id,customer_id]
        const return_update_query_result = await pool.query(return_update_query, return_update_value);
        console.log('Return Update Result:', return_update_query_result);

        const orders_update_query = `UPDATE public.orders SET qty = $1 , date = $2  WHERE order_id = $3 and customer_id = $4`
        const orders_update_value = [orderQty,date,order_id,customer_id]
        const orders_update_query_result = await pool.query(orders_update_query, orders_update_value);
        console.log('Order Update Result:', orders_update_query_result);

        const summary_update_query = `UPDATE public.summary SET return_qty = $1, order_qty = $2 , date = $3 WHERE return_id = $4 and order_id = $5`
        const summary_update_value = [returnQty,orderQty,date,return_id,order_id]
        const summary_update_query_result = await pool.query(summary_update_query, summary_update_value);
        console.log('Summary Update Result:', summary_update_query_result);


        response.setHeader('Access-Control-Allow-Origin', '*');
        response.status(200).json({ message: 'successfully' });
        
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: 'Error' , error:error});
    }

});

module.exports = router