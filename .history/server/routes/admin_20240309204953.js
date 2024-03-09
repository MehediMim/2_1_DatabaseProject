const express = require('express');
const router = express.Router();
const pool = require('../db');
const authorization = require('../middleware/authorization')

// In your server-side route handler file (e.g., routes/admin.js)
router.get('/orders', async (req, res) => {
    const { month } = req.query; // Expected to be in "YYYY-MM" format

    try {
        const query = `
            SELECT 
                o.order_id, 
                o.user_id, 
                o.total_price, 
                o.created_at, 
                o.status,
                ARRAY_AGG(od.*) AS order_details
            FROM orders o
            LEFT JOIN order_details od ON o.order_id = od.order_id
            WHERE TO_CHAR(o.created_at, 'YYYY-MM') = $1
            GROUP BY o.order_id
            ORDER BY o.created_at DESC;
        `;
        
        // If month is not provided, it will result in an error or empty response.
        // Consider handling this case differently based on your requirements.
        const { rows } = await pool.query(query, [month]);
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});



module.exports = router;
