const express = require('express');
const router = express.Router();
const pool = require('../db');
const authorization = require('../middleware/authorization')
// router.post('/placeorder', async (req, res) => {
//     const client = await pool.connect();
//     try {
//         await client.query('BEGIN'); // Start a transaction

//         const userId = req.user; // Assume req.user contains the user ID
        
//         // 1. Fetch cart items for the user
//         const cartItemsRes = await client.query(
//             'SELECT item_id, quantity, price FROM cart WHERE user_id = $1',
//             [userId]
//         );
//         const cartItems = cartItemsRes.rows;

//         // 2. Calculate total price
//         const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

//         // 3. Insert a new order
//         const orderRes = await client.query(
//             'INSERT INTO orders (user_id, total_price, status) VALUES ($1, $2, $3) RETURNING order_id',
//             [userId, totalPrice, 'Pending'] // Example status
//         );
//         const orderId = orderRes.rows[0].order_id;

//         // 4. Insert order details for each cart item
//         for (const item of cartItems) {
//             await client.query(
//                 'INSERT INTO order_details (order_id, item_id, quantity, price) VALUES ($1, $2, $3, $4)',
//                 [orderId, item.item_id, item.quantity, item.price]
//             );
//         }

//         // 5. Optionally, clear the user's cart
//         await client.query('DELETE FROM cart WHERE user_id = $1', [userId]);

//         await client.query('COMMIT'); // Commit the transaction
//         res.send('Order placed successfully');
//     } catch (err) {
//         await client.query('ROLLBACK'); // Roll back the transaction on error
//         console.error('Error executing query', err.stack);
//         res.status(500).send('Server error');
//     } finally {
//         client.release(); // Release the client back to the pool
//     }
// });
router.post('/cart/add/:itemId',authorization,async (req, res) => {
    console.log("Got no chill");
    try {
        const userId = req.user;
        const { itemId } = req.params;
        const { quantity } = req.body; // Assume these are passed in the request body
        console.log("userId",userId);
        console.log("itemId",itemId);
        console.log("quantity",quantity);
        // First, check if the item already exists in the user's cart
        const existingItemRes = await pool.query(
            'SELECT quantity FROM cart WHERE user_id = $1 AND item_id = $2',
            [userId, itemId]
        );

        if (existingItemRes.rows.length > 0) {
            // Item already exists, update quantity
            const newQuantity = existingItemRes.rows[0].quantity + quantity;
            await pool.query(
                'UPDATE cart SET quantity = $1 WHERE user_id = $2 AND item_id = $3',
                [newQuantity, userId, itemId]
            );
        } else {
            // Item does not exist, insert new record
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
