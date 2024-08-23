// dashboard.js
const express = require('express');
const router = express.Router();

// Weekly Sales Chart
router.get('/weekly-records', async (req, res) => {
    try {
        const pool = req.pool;
        const query = `
            SELECT 
                DATE_FORMAT(date, '%Y-%m-%d') as date, 
                SUM(issuedQuantity) as total_issued, 
                SUM(returnedQuantity) as total_returned 
            FROM records  -- Use 'records' instead of 'sales'
            WHERE date >= CURDATE() - INTERVAL 7 DAY
            GROUP BY date
            ORDER BY date ASC;
        `;
        const [results] = await pool.query(query);
        res.json(results);
    } catch (err) {
        console.error('Error fetching weekly sales data:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Branch Performance Chart Route
router.get('/branch-performance', async (req, res) => {
    try {
        const pool = req.pool;
        const query = `
            SELECT 
                branchName, 
                SUM(issuedQuantity) as total_issued, 
                SUM(returnedQuantity) as total_returned 
            FROM records
            WHERE date >= CURDATE() - INTERVAL 7 DAY
            GROUP BY branchName
            ORDER BY branchName ASC;
        `;
        const [results] = await pool.query(query);
        res.json(results);
    } catch (err) {
        console.error('Error fetching branch performance data:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Session Comparison Chart Route
router.get('/session-comparison', async (req, res) => {
    try {
        const pool = req.pool;
        const query = `
            SELECT 
                session, 
                SUM(issuedQuantity) as total_issued, 
                SUM(returnedQuantity) as total_returned 
            FROM records
            WHERE date >= CURDATE() - INTERVAL 7 DAY
            GROUP BY session
            ORDER BY session ASC;
        `;
        const [results] = await pool.query(query);
        res.json(results);
    } catch (err) {
        console.error('Error fetching session comparison data:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
