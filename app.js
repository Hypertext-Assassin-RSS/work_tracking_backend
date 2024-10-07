require('./instrument.js');

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const Customer = require('./routes/Customer');
const Order = require('./routes/Order');
const Product = require('./routes/Product');
const Return = require('./routes/Return');
const Summary = require('./routes/Summary');

const app = express();
const port = process.env.PORT || "3000";


app.use(express.json());
app.use(cors());


app.use('/customer', Customer);
app.use('/order', Order);
app.use('/product', Product);
app.use('/return', Return);
app.use('/summary', Summary);


app.get('/', (req, res) => {
    res.status(404).send('404 Not Found!');
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


app.use(function onError(err, req, res, next) {
    res.status(500).send("Something went wrong!");
});
