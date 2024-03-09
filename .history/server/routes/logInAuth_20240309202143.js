const express = require('express');
const router = express.Router();
const pool = require("../db");
const bcrypt = require('bcrypt');
const jwtGenerator = require("../utils/jwtGenerator");
const validinfo =require('../middleware/validinfoLogIn')

router.post('/', async (req, res) => {
    try {
        const { identity, password } = req.body;

        const loginQuery = `
          SELECT *
          FROM users
          WHERE email = $1 OR phone_number = $1
        `;
        const result = await pool.query(loginQuery, [identity]);
        if (result.rows.length > 0) {
            const user = result.rows[0];
  
            // Use bcrypt to compare the provided password with the stored hash
           const isMatch = await bcrypt.compare(password, user.password_hash);//  mehedi mim
            // const isMatch = (password === user.password_hash);


            if (isMatch) {

                const token = jwtGenerator(user.user_id); 
                
                res.json({token});
            } else {

                res.status(401).send("Password is incorrect");
            }
        } else {

            res.status(404).send("User not found");
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Something went wrong on the server');
    }
});

module.exports = router;
