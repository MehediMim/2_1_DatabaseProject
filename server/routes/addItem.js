const express = require('express');
const router = express.Router();
const pool = require('../db');
const authorization = require('../middleware/authorization')

router.get('/getCategory', async (req, res) => {
    console.log("Request received for categories");
    try {
        const categoryList = await pool.query(
            `SELECT name
            FROM categories
            ORDER BY name;`
        );
        console.log(categoryList.rows); // Log the fetched category list
        res.json(categoryList.rows); // Send the category list back to the client
    } catch (err) {
        console.error(err.message);
        res.status(500).json("server error");
    }
});

router.get('/getSubcategory/:categoryName', async (req, res) => {
    const { categoryName } = req.params;
    try {
        // Use a JOIN to fetch subcategories based on category name
        const subcategoryList = await pool.query(
            `SELECT sub.name 
            FROM subcategories sub
            JOIN categories cat ON sub.category_id = cat.category_id 
            WHERE cat.name = $1 
            ORDER BY sub.name;`,
            [categoryName]
        );
        console.log(subcategoryList.rows); // Log the fetched category list
        res.json(subcategoryList.rows.map(row => row.name));
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server error");
    }
});

router.post('/addItem', authorization, async (req, res) => {
    console.log("Request received for Add");
    const user_id = req.user; // Assuming req.user contains the user_id
    const { itemName, itemDescription, itemPrice, itemImage, itemCategory, itemSubcategory } = req.body;
    const status = "available"; // Set status to "available" directly

    // Define a single SQL query using CTEs to insert the new item
    const query = `
        WITH category_id AS (
            SELECT category_id FROM categories WHERE name = $1
        ), subcategory_id AS (
            SELECT subcategory_id FROM subcategories WHERE name = $2 AND category_id = (SELECT category_id FROM category_id)
        )
        INSERT INTO items (user_id, category_id, subcategory_id, name, description, image, price, status)
        SELECT $3, (SELECT category_id FROM category_id), (SELECT subcategory_id FROM subcategory_id), $4, $5, $6, $7, $8
        WHERE EXISTS (SELECT 1 FROM category_id) AND EXISTS (SELECT 1 FROM subcategory_id)
        RETURNING *;
    `;

    try {
        const newItem = await pool.query(query, [itemCategory, itemSubcategory, user_id, itemName, itemDescription, itemImage, itemPrice, status]);
        
        if (newItem.rows.length === 0) {
            return res.status(400).json("Category or Subcategory not found");
        }
        
        console.log(newItem.rows[0]);
        res.json(newItem.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server error");
    }
});


module.exports = router;
