const express = require('express');
const router = express.Router();
const pool = require('../db');
const authorization = require('../middleware/authorization')

router.get('/', authorization, async (req, res) => {
    try {
        console.log("Cart GET");
        const userId = req.user; 
        console.log(userId);
        


        const userCartItems = await pool.query(
            `SELECT 
            c.item_id, 
            i.name, 
            i.description, 
            i.price, 
            c.quantity, 
            (i.price * c.quantity) AS total_price
            FROM cart c
            JOIN items i ON c.item_id = i.item_id
            WHERE c.user_id = $1`,
            [userId]
        );


        if (userCartItems.rows.length === 0) {
            return res.status(404).json({ message: "No items in cart." });
        }


        console.log[userCartItems.rows];
        res.json(userCartItems.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server error");
    }
});

router.post('/', authorization, async (req, res) => {
    console.log("Cart POST");
    try {
        const userId = req.user; 
        const { item_id, quantity } = req.body; 


        const newItem = await pool.query(
            `INSERT INTO cart (user_id, item_id, quantity)
                VALUES ($1, $2, $3)
                ON CONFLICT (user_id, item_id) 
                DO UPDATE SET quantity = cart.quantity + $3
                RETURNING *`,
            [userId, item_id, quantity]
        );

        res.json(newItem.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server error");
    }
});

router.patch('/:itemId', authorization, async (req, res) => {
    console.log("Cart PATCH");
    try {
        const userId = req.user;
        const { itemId } = req.params; 
        const { quantity } = req.body; 


        const updateItem = await pool.query(
            `UPDATE cart SET quantity = $1
            WHERE user_id = $2 AND item_id = $3
            RETURNING *`,
            [quantity, userId, itemId]
        );

        if (updateItem.rows.length === 0) {
            return res.status(404).json({ message: "Item not found in cart." });
        }

        res.json(updateItem.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server error");
    }
});

router.delete('/:itemId', authorization, async (req, res) => {
    console.log("Cart DELETTE");
    try {
        const userId = req.user;
        const { itemId } = req.params; 
        // console.log(req);
        console.log(userId);
        console.log(itemId);


        const deleteItem = await pool.query(
            `DELETE FROM cart
                WHERE user_id = $1 AND item_id = $2
                RETURNING *`,
            [userId, itemId]
        );

        if (deleteItem.rows.length === 0) {
            return res.status(404).json({ message: "Item not found in cart." });
        }

        res.json({ message: "Item removed from cart." });
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server error");
    }
});

// router.post('/complete-order', authorization, async (req, res) => {
//     console.log("got signnnnal");
//     const user_id = req.user; 
//     const { total_price, cartItems, shippingInfo, paymentInfo, cardInfo } = req.body;
//     console.log(user_id, total_price, cartItems, shippingInfo, paymentInfo, cardInfo);
    
//     try {
//         await pool.query('BEGIN');


//         const orderResult = await pool.query(
//             'INSERT INTO orders (user_id, total_price, status) VALUES ($1, $2, $3) RETURNING order_id',
//             [user_id, total_price, 'placed']
//         );
//         const orderId = orderResult.rows[0].order_id;

//         for (const item of cartItems) {
//             await pool.query(
//                 'INSERT INTO order_details (order_id, item_id, quantity, price) VALUES ($1, $2, $3, $4)',
//                 [orderId, item.item_id, item.quantity, item.price]
//             );
//         }

//         await pool.query(
//             'INSERT INTO shipping_info (order_id, address_line1, address_line2, city, division, zip_code, shipping_date) VALUES ($1, $2, $3, $4, $5, $6, $7)',
//             [orderId, shippingInfo.addressLine1, shippingInfo.addressLine2, shippingInfo.city, shippingInfo.division, shippingInfo.zipCode, shippingInfo.shippingDate]
//         );

//         await pool.query(
//             'INSERT INTO payments (order_id, user_id, amount, payment_method) VALUES ($1, $2, $3, $4)',
//             [orderId, user_id, paymentInfo.amount, paymentInfo.paymentMethod]
//         );

//         if (paymentInfo.paymentMethod === 'Credit Card') {
//             await pool.query(
//                 'INSERT INTO card_info (user_id, card_number, card_holder_name, expiry_month, expiry_year, cvv) VALUES ($1, $2, $3, $4, $5, $6)',
//                 [user_id, cardInfo.cardNumber, cardInfo.cardHolderName, cardInfo.expiryMonth, cardInfo.expiryYear, cardInfo.cvv]
//             );
//         }

//         await pool.query(
//             'DELETE FROM cart WHERE user_id = $1',
//             [user_id]
//         );

//         await pool.query('COMMIT');

//         res.json({ message: 'Order completed successfully', orderId });
//     } catch (error) {
//         await pool.query('ROLLBACK'); 
//         console.error('Error processing order:', error);
//         res.status(500).send('Server error during order processing');
//     }
// });

router.post('/complete-order', authorization, async (req, res) => {
    console.log("got signal");
    const { user_id } = req.user; // Ensure this extracts the user ID correctly
    const { total_price, cartItems, shippingInfo, paymentInfo, cardInfo } = req.body;
    console.log(user_id, total_price, cartItems, shippingInfo, paymentInfo, cardInfo);

    try {
        // Prepare the cartItems in the format expected by the PostgreSQL function
        // Depending on how your function expects the cartItems array, you might need to serialize it
        // This example assumes your function can accept a JSON representation of cartItems
        const cartItemsFormatted = JSON.stringify(cartItems);

        // Call the PL/pgSQL function
        const functionCallQuery = `
            SELECT complete_order_function(
                $1, $2, $3::cart_item_type[], $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
            ) AS order_id;
        `;
        const queryParams = [
            user_id,
            total_price,
            cartItemsFormatted,
            shippingInfo.addressLine1,
            shippingInfo.addressLine2,
            shippingInfo.city,
            shippingInfo.division,
            shippingInfo.zipCode,
            shippingInfo.shippingDate,
            paymentInfo.amount,
            paymentInfo.paymentMethod,
            cardInfo.cardNumber,
            cardInfo.cardHolderName,
            cardInfo.expiryMonth,
            cardInfo.expiryYear,
            cardInfo.cvv
        ];

        const result = await pool.query(functionCallQuery, queryParams);
        const orderId = result.rows[0].order_id;

        res.json({ message: 'Order completed successfully', orderId });
    } catch (error) {
        console.error('Error processing order with PL/pgSQL function:', error);
        res.status(500).send('Server error during order processing with function');
    }
});





module.exports = router;
