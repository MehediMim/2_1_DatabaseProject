const express = require('express');
const router = express.Router();
const pool = require('../db'); // Assuming you've set up your pool correctly in ../db
const authorization = require('../middleware/authorization'); // Your authorization middleware

// Route to get orders, optionally filtered by a month (YYYY-MM)
router.get('/orders', authorization, async (req, res) => {
    const month = req.query.month; // Format expected "YYYY-MM"

    try {
        let query = `
            SELECT 
                o.order_id, 
                o.user_id, 
                o.total_price, 
                o.created_at, 
                o.status, 
                json_agg(
                    json_build_object(
                        'item_id', od.item_id, 
                        'quantity', od.quantity, 
                        'price', od.price
                    )
                ) FILTER (WHERE od.item_id IS NOT NULL) AS order_details
            FROM orders o
            LEFT JOIN order_details od ON o.order_id = od.order_id
        `;

        const queryParams = [];

        // If a month is provided, add a WHERE clause to filter by that month
        if (month) {
            query += ` WHERE TO_CHAR(o.created_at, 'YYYY-MM') = $1`;
            queryParams.push(month);
        }

        // Group by order_id to aggregate the JSON objects of order_details
        query += ` GROUP BY o.order_id ORDER BY o.created_at DESC`;

        const { rows } = await pool.query(query, queryParams);
        res.json(rows);
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
