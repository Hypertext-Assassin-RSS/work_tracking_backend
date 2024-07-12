const express = require('express')
const Agent = require('./routes/Agent')
const Order = require('./routes/Order')
const Product = require('./routes/Product')
const Return = require('./routes/Return')

const cors=require('cors');
require('dotenv').config();

const app = express();
const port = 4000

app.use(express.json())
app.use(cors())

app.use('/agent',Agent)
app.use('/order',Order)
app.use('/product',Product)
app.use('/return',Return)

app.listen(port, (req,res) => {
    console.log(`Example app listening on port ${port}`)
})

app.get('/', (req, res) => {
    res.send('Hello World!')
})

