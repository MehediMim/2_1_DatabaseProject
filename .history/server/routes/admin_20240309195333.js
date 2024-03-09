const express = require('express');
const router = express.Router();
const pool = require('../db');
const authorization = require('../middleware/authorization')

router.get('/orders', async (req, res) => {
    try {
        const query = `
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
            ORDER BY o.created_at DESC;
        `;

        const { rows } = await pool.query(query);
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


module.exports = router;
