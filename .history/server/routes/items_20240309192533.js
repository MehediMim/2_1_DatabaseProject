const express = require('express');
const router = express.Router();
const pool = require('../db');
const authorization = require('../middleware/authorization')


router.post('/cart/add/:itemId',authorization,async (req, res) => {
    console.log("Got no chill");
    try {
        const userId = req.user;
        const { itemId } = req.params;
        const { quantity } = req.body; 
        console.log("userId",userId);
        console.log("itemId",itemId);
        console.log("quantity",quantity);

        const existingItemRes = await pool.query(
            'SELECT quantity FROM cart WHERE user_id = $1 AND item_id = $2',
            [userId, itemId]
        );

        if (existingItemRes.rows.length > 0) {

            const newQuantity = existingItemRes.rows[0].quantity + quantity;
            await pool.query(
                'UPDATE cart SET quantity = $1 WHERE user_id = $2 AND item_id = $3',
                [newQuantity, userId, itemId]
            );
        } else {

            await pool.query(
                'INSERT INTO cart (user_id, item_id, quantity) VALUES ($1, $2, $3)',
                [userId, itemId, quantity]
            );
        }

        res.json({ message: "Item added to cart successfully" });
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Server error');
    }
});
module.exports = router;
