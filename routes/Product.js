const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();
const db = require('../db/db')

const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  
const today = new Date();

const currentMonth = monthNames[today.getMonth()];
const lastMonth = monthNames[(today.getMonth() -1)];


const createProductsTableQuery = `CREATE TABLE IF NOT EXISTS Product (
  "product_code" VARCHAR(255) NOT NULL,
  "product_desc" VARCHAR(255) NULL,
  "product_isbn" VARCHAR(255) NULL,
  "product_supplier" INTEGER NULL,
  "product_progroup" INTEGER NULL,
  "product_procategory" VARCHAR(255) NULL,
  "product_author" VARCHAR(255) NULL,
  "product_publisher" VARCHAR(255) NULL,
  "product_medium" INTEGER NULL,
  "product_active" INTEGER NULL,
  "product_cprice" NUMERIC NULL,
  "product_sprice" NUMERIC NULL,
  "product_stockcode" INTEGER NULL,
  "product_shelfno" INTEGER NULL,
  "product_covertype" VARCHAR(255) NULL,
  "product_edition" VARCHAR(255) NULL,
  "product_copyrightyear" INTEGER NULL,
  "product_pages" INTEGER NULL,
  "product_lastseq" INTEGER NULL,
  "product_exbatch" VARCHAR(255) NULL,
  "product_dtransfer" INTEGER NULL,
  "product_descother" VARCHAR(255) NULL,
  "product_barcodesize" INTEGER NULL,
  "product_allowdecimal" INTEGER NULL,
  "product_activediscount" INTEGER NULL,
  "product_service" INTEGER NULL,
  "product_longdesc" TEXT NULL,
  "product_wprice" NUMERIC NULL,
  "product_packsize" INTEGER NULL,
  "product_othername" VARCHAR(255) NULL,
  "product_defloc" INTEGER NULL,
  "product_costper" NUMERIC NULL,
  "product_mrpper" NUMERIC NULL,
  "product_wspper" NUMERIC NULL,
  "product_supprice" NUMERIC NULL,
  "product_mediumprice" NUMERIC NULL,
  "product_minprice" NUMERIC NULL,
  "product_supliment" VARCHAR(255) NULL,
  "product_sa" INTEGER NULL,
  "product_serial" INTEGER NULL,
  "product_warranty" INTEGER NULL,
  "product_supplierwarranty" INTEGER NULL,
  "product_customerwarranty" INTEGER NULL,
  "product_companyprice" NUMERIC NULL,
  "product_weighted" INTEGER NULL,
  "product_activeforsalcomm" INTEGER NULL,
  "product_salcommamt" NUMERIC NULL,
  "product_salcommper" NUMERIC NULL,
  "product_uom" VARCHAR(255) NULL,
  "product_minpriceen" NUMERIC NULL,
  "product_subitem" INTEGER NULL,
  "product_subitemcode" VARCHAR(255) NULL,
  "product_costperen" NUMERIC NULL,
  "product_minspriceen" NUMERIC NULL,
  "product_id" INTEGER NULL,
  "dept" INTEGER NULL,
  "product_unitprice" NUMERIC NULL,
  "product_allowminus" INTEGER NULL,
  "product_creditperiod" INTEGER NULL,
  "dtdate" TIMESTAMP NULL,
  "product_allowvat" INTEGER NULL,
  "product_isnonrefund" INTEGER NULL,
  "product_isexchangeable" INTEGER NULL,
  "product_ref8" VARCHAR(255) NULL,
  "product_mainitem" VARCHAR(255) NULL,
  "product_glassschno" INTEGER NULL,
  "product_repcomm" NUMERIC NULL,
  "product_techcomm" NUMERIC NULL,
  "product_managercomm" NUMERIC NULL,
  "product_distriprice" NUMERIC NULL,
  "product_coopprice" NUMERIC NULL,
  "product_salesrepatpos" INTEGER NULL,
  "product_markedcust" INTEGER NULL,
  "product_iscash" INTEGER NULL,
  "product_otheruom" VARCHAR(255) NULL,
  "product_convertion" NUMERIC NULL,
  "product_isservice" INTEGER NULL,
  "product_timecons" INTEGER NULL,
  "product_manid" INTEGER NULL,
  "product_tacomallowed" INTEGER NULL,
  "product_salooncomallowed" INTEGER NULL,
  "product_vatportion" NUMERIC NULL,
  "product_weight" NUMERIC NULL,
  "product_isfootware" INTEGER NULL,
  "product_rackno" VARCHAR(255) NULL,
  "product_rowitem" INTEGER NULL,
  "product_iswebitem" INTEGER NULL,
  CONSTRAINT "product_pkey" PRIMARY KEY ("product_code")
);`;

const pool = db.getPool();
pool.connect()
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
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(rows);
    } catch (err) {
        res.status(500).send('Data Load Failed: ' + err.message);
    }
});


router.get('/month', async (req, res) => {
    try {
        const query = `select * from products where product_month = $1`;
        const { rows } = await pool.query(query, [currentMonth]);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(rows);
    } catch (err) {
        res.status(500).send('Data Load Failed: ' + err.message);
    }
});

router.get('/last', async (req, res) => {
    try {
        const query = `select * from products where product_month = $1`;
        const { rows } = await pool.query(query, [lastMonth]);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.json(rows);
    } catch (err) {
        res.status(500).send('Data Load Failed: ' + err.message);
    }
});


module.exports = router;