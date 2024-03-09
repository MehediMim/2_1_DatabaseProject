const express = require('express');
const router = express.Router();
const pool = require('../db');



router.get('/', async (req, res) => {
    try {
        const discount = await pool.query(`SELECT unnest(enum_range(NULL::discount_type)) AS discount_type`);
 
        res.json(discount.rows);


    } catch (err) {
        console.error(err.message);
        res.status(500).json("server error");
    }
});

router.post('/',  async (req, res) => {
    try {
      
      // Validate the start_date format
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(req.body.startDate)) {
          console.error('Invalid date format');
        }
      const newDiscount = await pool.query(
        `INSERT INTO discounts (discount_type, description, start_date, duration_days, duration_hours) VALUES($1, $2, TO_DATE($3, 'YYYY-MM-DD'), $4, $5) RETURNING *`,
        [req.body.discountType, req.body.description, req.body.startDate, req.body.duration_days, req.body.duration_hours]
      );
      console.log('newDiscount', newDiscount.rows[0]);
    } catch (err) {
      console.error(err.message);
      res.status(500).json("server error");
    }
  });





module.exports = router;