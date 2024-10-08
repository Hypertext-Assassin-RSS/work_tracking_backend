require("./instrument");


const express = require('express');
const Sentry = require('@sentry/node');

const Tracing = require('@sentry/tracing');
const Agent = require('./routes/Agent');
const Customer = require('./routes/Customer');
const Order = require('./routes/Order');
const Product = require('./routes/Product');
const Return = require('./routes/Return');
const Summary = require('./routes/Summary');

const cors = require('cors');
require('dotenv').config();


const { createServer } = require("node:http");

const app = express();
const port = process.env.PORT || "3000";

// Initialize Sentry
Sentry.init({
    dsn: process.env.SENTRY_DSN,  // Your Sentry DSN (Data Source Name)
    integrations: [
        // Enable HTTP request tracing
        new Tracing.Integrations.Express({ app }),
        Sentry.nodeContextIntegration,
    ],
    tracesSampleRate: 1.0,  // Adjust this value for performance tracing
});

app.use(express.json());
// CORS configuration
const corsOptions = {
    origin: 'https://work-tracking-frontend.fly.dev',  // Frontend origin URL
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true  // Allow sending cookies if needed
};
app.use(cors(corsOptions));

// app.use('/agent',Agent)
app.use('/customer', Customer);
app.use('/order', Order);
app.use('/product', Product);
app.use('/return', Return);
app.use('/summary', Summary);

// Fallback route for invalid paths
app.get('/', (req, res) => {
    res.status(404).send('404 Not Found!');
});

// Capture errors and send to Sentry
app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
  });
  

// Start the server
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

// Fallback error handler
app.use(function onError(err, req, res, next) {
    res.status(500).send("Something went wrong!");
});
