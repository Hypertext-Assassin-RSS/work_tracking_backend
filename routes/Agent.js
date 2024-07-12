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


const createAgentsTableQuery = `
    CREATE TABLE IF NOT EXISTS agents (
        agent_code VARCHAR(50) PRIMARY KEY,
        agent_name VARCHAR(255) NOT NULL,
        agent_address VARCHAR(255),
        contact_number VARCHAR(20)
    )
`;

pool.query(createAgentsTableQuery, (err, result) => {
    if (err) {
        console.error('Error creating Agents table:', err);
    } else {
        console.log('Agents table created or already exists');
    }
});

router.use(express.json());
router.use(cors());

// GET all agents
router.get('/', async (req, res) => {
    try {
        const query = 'SELECT * FROM agents';
        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (err) {
        res.status(500).send('Data Load Failed: ' + err.message);
    }
});

// POST save new agent
router.post('/save', async (req, res) => {
    try {
        const { agent_code, agent_name, agent_address, contact_number } = req.body;
        const query = 'INSERT INTO agents(agent_code, agent_name, agent_address, contact_number) VALUES ($1, $2, $3, $4)';
        await pool.query(query, [agent_code, agent_name, agent_address, contact_number]);
        res.status(200).json({ status: 200, message: `Agent ${agent_code} Saved` });
    } catch (err) {
        res.status(500).json({ error: err.message, status: 404, message: `Agent ${req.body.agent_code} not saved!!!` });
    }
});

// PUT update agent
router.put('/update', async (req, res) => {
    try {
        const { agent_code, agent_name, agent_address, contact_number } = req.body;
        const query = 'UPDATE agents SET agent_name = $2, agent_address = $3, contact_number = $4 WHERE agent_code = $1';
        const result = await pool.query(query, [agent_code, agent_name, agent_address, contact_number]);
        res.json({ message: `Agent ${agent_code} Update Success`, result: result.rows[0] });
    } catch (err) {
        res.status(500).send('Update Failed: ' + err.message);
    }
});

// DELETE agent
router.delete('/delete', async (req, res) => {
    try {
        const agent_code = req.query.agent_code;
        const query = 'DELETE FROM agents WHERE agent_code = $1';
        const result = await pool.query(query, [agent_code]);
        res.json({ message: `Agent ${agent_code} Deleted!` });
    } catch (err) {
        res.status(500).send(`Agent ${req.query.agent_code} Delete Failed: ${err.message}`);
    }
});

// SEARCH agent by agent_code
router.get('/search', async (req, res) => {
    try {
        const agent_code = req.query.agent_code;
        const query = 'SELECT * FROM agents WHERE agent_code = $1';
        const { rows } = await pool.query(query, [agent_code]);
        res.json({ message: `Agent ${agent_code} Search Success`, result: rows });
    } catch (err) {
        res.status(500).send(`Agent ${req.query.agent_code} Search Failed: ${err.message}`);
    }
});
module.exports = router;
