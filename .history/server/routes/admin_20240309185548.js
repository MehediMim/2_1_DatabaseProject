const express = require('express');
const router = express.Router();
const pool = require('../db');
const authorization = require('../middleware/authorization')

router.get('/orders', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
      res.json(rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });


module.exports = router;
