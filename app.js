const express = require('express')
const Agent = require('./routes/Agent')
const Customer = require('./routes/Customer')
const Order = require('./routes/Order')
const Product = require('./routes/Product')
const Return = require('./routes/Return')
const Summary = require('./routes/Summary')

const cors=require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || "8080";

app.use(express.json())
app.use(cors())

// app.use('/agent',Agent)
app.use('/customer',Customer)
app.use('/order',Order)
app.use('/product',Product)
app.use('/return',Return)
app.use('/summary',Summary)

app.listen(port, (req,res) => {
    console.log(`Example app listening on port ${port}`)
})

app.get('/', (req, res) => {
    res.status(404).send('404 Not Found!');
})

