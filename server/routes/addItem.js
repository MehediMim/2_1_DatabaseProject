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
router.get('/getDetails/:item_id', async (req, res) => {
    // console.log("Request received for item details, Item ID:", req.params.item_id);

    try {
        const query = await pool.query(
            `SELECT
            i.item_id,
            i.name AS item_name,
            i.description,
            i.image,
            i.price AS old_price,
            COALESCE(d.discount, 0) AS discount,
            d.start_date,
            d.duration,
            CURRENT_TIMESTAMP,
            CASE
                WHEN d.discount IS NOT NULL AND CURRENT_TIMESTAMP BETWEEN d.start_date AND (d.start_date + INTERVAL '300 day' * d.duration) THEN ROUND(i.price * (1 - d.discount / 100), 2)
                ELSE i.price
            END AS discounted_price,
            c.name AS category_name,
            sc.name AS subcategory_name,
            u.user_id,
            (u.first_name || ' ' || u.last_name) AS seller_name,
            u.email,
            upn.phone_number,
            ROUND(AVG(r.star_rating)) AS average_rating,
            usr.avg_user_rating AS user_rating
        FROM items i
        LEFT JOIN item_discounts id ON i.item_id = id.item_id
        LEFT JOIN discounts d ON id.discount_id = d.discount_id
            AND CURRENT_TIMESTAMP BETWEEN d.start_date AND (d.start_date + INTERVAL '300 day' * d.duration)
        JOIN users u ON i.user_id = u.user_id
        LEFT JOIN (
            SELECT
                ri.user_id,
                ROUND(AVG(r.star_rating), 2) AS avg_user_rating
            FROM reviews r
            JOIN items ri ON r.item_id = ri.item_id
            GROUP BY ri.user_id
        ) usr ON u.user_id = usr.user_id
        LEFT JOIN user_phone_number upn ON u.user_id = upn.user_id
        JOIN categories c ON i.category_id = c.category_id
        JOIN subcategories sc ON i.subcategory_id = sc.subcategory_id
        LEFT JOIN reviews r ON i.item_id = r.item_id
        WHERE i.item_id = $1
        GROUP BY i.item_id, u.user_id, upn.phone_number, c.name, sc.name, d.discount, d.start_date, d.duration, usr.avg_user_rating
        `,
            [req.params.item_id]
        );
        if (query.rows.length) {
            res.json(query.rows[0]);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server error");
    }
});
router.get('/getreviews/:item_id', async (req, res) => {
    // console.log("Request received for reviews details, Item ID:", req.params.item_id);

    try {
        const reviewsQuery = `
            SELECT
                r.content,
                r.user_id,
                r.item_id,
                r.star_rating,
                r.upvotes,
                r.downvotes,
                r.date_posted,
                (u.first_name || ' ' || u.last_name) AS reviewer_name
            FROM reviews r
            JOIN users u ON r.user_id = u.user_id
            WHERE r.item_id = $1
            ORDER BY r.date_posted DESC;
        `;

        // Execute query for reviews
        const reviewsResult = await pool.query(reviewsQuery, [req.params.item_id]);
        const reviews = reviewsResult.rows;

        // Combine item details with reviews and send response
        const responsePayload = {
            reviews: reviews
        };

        res.json(responsePayload);
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server error");
    }
});

router.get('/getitems/:category_name', async (req, res) => {
    console.log("Request received for category_name:", req.params.category_name);

    try {
        const query = await pool.query(`
            SELECT items.* 
            FROM items
            JOIN categories ON items.category_id = categories.category_id
            WHERE categories.name = $1
        `, [req.params.category_name]);
        // console.log(query.rows);
        if (query.rows.length) {
            res.json(query.rows);
        } else {
            res.status(404).json({ message: 'No items found for this category' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json("Server error");
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
    console.log("Request received for Add", req.body);
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

router.post('/reviews', authorization,async (req, res) => {
    console.log("review almost added");
    const user_id=req.user;
    const { item_id, content, star_rating } = req.body;
    console.log(user_id);
    console.log(item_id);
    console.log(content);
    console.log(star_rating);
  
    try {
      const result = await pool.query(
        'INSERT INTO reviews (item_id, user_id, content, star_rating) VALUES ($1, $2, $3, $4) RETURNING *',
        [item_id, user_id, content, star_rating]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error submitting review:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  router.post('/vote', async (req, res) => {
    console.log("Received vote request");
    const { user_id, item_id, vote_type } = req.body; // Use user_id and item_id instead of review_id
    console.log(user_id, item_id, vote_type);
    const token = req.headers['token']; // Authentication token

    // Simple authentication check (should be replaced with actual auth logic)
    if (!token) {
        return res.status(403).json({ error: 'No token provided, must be logged in to vote.' });
    }

    try {
        // Update the appropriate vote count based on the vote_type
        if (vote_type === 'upvote') {
            await pool.query('UPDATE reviews SET upvotes = upvotes + 1 WHERE user_id = $1 AND item_id = $2', [user_id, item_id]);
        } else if (vote_type === 'downvote') {
            await pool.query('UPDATE reviews SET downvotes = downvotes + 1 WHERE user_id = $1 AND item_id = $2', [user_id, item_id]);
        } else {
            return res.status(400).json({ error: 'Invalid vote type. Must be "upvote" or "downvote".' });
        }

        // Optionally, retrieve and send back the updated review to the client
        // const { rows } = await pool.query('SELECT * FROM reviews WHERE user_id = $1 AND item_id = $2', [user_id, item_id]);
        // res.json(rows[0]);

        res.status(200).json({ message: 'Vote registered successfully' });
    } catch (error) {
        console.error('Error in vote registration:', error);
        res.status(500).json({ error: 'Failed to register vote' });
    }
});

module.exports = router;
