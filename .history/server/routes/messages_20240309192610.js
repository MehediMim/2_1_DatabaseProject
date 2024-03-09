const express = require('express');
const router = express.Router();
const pool = require('../db');
const authorization = require('../middleware/authorization')
router.get('/contacts/', authorization, async (req, res) => {

    try {
        const  userId  = req.user;

        const contactsQuery = `
            SELECT DISTINCT users.user_id, users.last_name
            FROM messages
            JOIN users ON users.user_id = messages.user_id_receiver OR users.user_id = messages.user_id_sender
            WHERE (messages.user_id_sender = $1 OR messages.user_id_receiver = $1) AND users.user_id != $1
            ORDER BY users.last_name;
        `;
        const contactsResult = await pool.query(contactsQuery, [userId]);

        res.json(contactsResult.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});
router.get('/conversation/:id', authorization, async (req, res) => {

    try {
        const userId = req.user; 
        const contactId = req.params.id;

        
        const messagesQuery = `
            SELECT *, 
                CASE 
                    WHEN user_id_sender = $1 THEN 2
                    WHEN user_id_sender = $2 THEN 1
                    ELSE 0
                END AS sender_role
            FROM messages 
            WHERE (user_id_sender = $1 AND user_id_receiver = $2) 
            OR (user_id_sender = $2 AND user_id_receiver = $1) 
            ORDER BY message_date ASC;
        `;
        
        const contactsResult = await pool.query(messagesQuery, [userId, contactId]);
        // console.log(contactsResult.rows);
        res.json(contactsResult.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});
router.post('/send', authorization, async (req, res) => {
    console.log("sent request ");
    try {
        const user_id_sender=req.user;
        const { user_id_receiver, message } = req.body;
        // console.log(req.body);

        // Validation (Ensure user_id_sender matches the authorized user)
        if (req.user !== user_id_sender) {
            return res.status(403).send("Unauthorized: Sender ID does not match logged-in user.");
        }

        const insertQuery = `
            INSERT INTO messages(user_id_sender, user_id_receiver, message)
            VALUES ($1, $2, $3);
        `;

        const insertResult = await pool.query(insertQuery, [user_id_sender, user_id_receiver, message]);
        

        res.status(201).json(insertResult.rows[0]);
        // console.log(insertResult.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});


module.exports = router;
