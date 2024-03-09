const express = require('express');
const router = express.Router();
const pool = require('../db');
const authorization = require('../middleware/authorization');

// GET /admin/orders endpoint to fetch orders, optionally filtered by month
router.get('/admin/orders', authorization, async (req, res) => {
    const { month } = req.query; // month expected in "YYYY-MM" format

    try {
        // Construct the base SQL query
        let sqlQuery = `
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
                ) AS order_details
            FROM orders o
            LEFT JOIN order_details od ON o.order_id = od.order_id
        `;

        const queryParams = [];

        // If a month is specified, add a WHERE clause to filter orders by that month
        if (month) {
            sqlQuery += ` WHERE TO_CHAR(o.created_at, 'YYYY-MM') = $1`;
            queryParams.push(month);
        }

        // Complete the SQL query with GROUP BY and ORDER BY clauses
        sqlQuery += `
            GROUP BY o.order_id
            ORDER BY o.created_at DESC
        `;

        // Execute the query with or without the month filter
        const result = await pool.query(sqlQuery, queryParams);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
