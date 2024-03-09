const express = require('express');
const router = express.Router();
const pool = require('../db');
const authorization = require('../middleware/authorization');

router.get('/orders', authorization, async (req, res) => {
    const month = req.query.month; // Format expected "YYYY-MM"
    try {
        let query;
        let queryParams = [];

        if (month) {
            // Adjust the query to filter by the selected month
            query = `
                SELECT 
                    o.order_id, 
                    o.user_id, 
                    o.total_price, 
                    o.created_at, 
                    o.status, 
                    json_agg(json_build_object('item_id', od.item_id, 'quantity', od.quantity, 'price', od.price)) AS order_details
                FROM orders o
                JOIN order_details od ON o.order_id = od.order_id
                WHERE TO_CHAR(o.created_at, 'YYYY-MM') = $1
                GROUP BY o.order_id
                ORDER BY o.created_at DESC
            `;
            queryParams.push(month);
        } else {
            // If no month is specified, fetch all orders
            query = `
                SELECT 
                    o.order_id, 
                    o.user_id, 
                    o.total_price, 
                    o.created_at, 
                    o.status, 
                    json_agg(json_build_object('item_id', od.item_id, 'quantity', od.quantity, 'price', od.price)) AS order_details
                FROM orders o
                JOIN order_details od ON o.order_id = od.order_id
                GROUP BY o.order_id
                ORDER BY o.created_at DESC
            `;
        }

        const { rows } = await pool.query(query, queryParams);
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
