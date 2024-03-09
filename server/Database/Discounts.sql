CREATE TYPE discount_type AS ENUM (
  'free shipping',
  'fixed amount discount',
  'percentage discount',
  'buy x get y free',
  'guarantee ',
  'cashback'
);

CREATE SEQUENCE discounts_discount_id_seq START WITH 1;

CREATE TABLE discounts (
  discount_id INT DEFAULT nextval('discounts_discount_id_seq') PRIMARY KEY,
  discount_type VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  start_date date NOT NULL,
  duration_days INT NOT NULL,
  duration_hours INT NOT NULL CHECK (duration_hours >= 0),
  ongoing BOOLEAN DEFAULT FALSE
);
SELECT setval('discounts_discount_id_seq', COALESCE((SELECT MAX(discount_id) FROM discounts), 1), false);






--many to many relationship between items and discounts
CREATE TABLE item_discounts (
    item_id INT NOT NULL,
    discount_id INT NOT NULL,
    PRIMARY KEY (item_id, discount_id),
    FOREIGN KEY (item_id) REFERENCES items(item_id),
    FOREIGN KEY (discount_id) REFERENCES discounts(discount_id)
);

CREATE OR REPLACE FUNCTION get_eligible_items(discount_id INT, cat_id INT)
RETURNS TABLE (item_id INT)
LANGUAGE plpgsql
AS $$
DECLARE
    discount_type_value discount_type;
BEGIN
    -- Get the discount type for the given discount_id
    SELECT d.discount_type INTO discount_type_value
    FROM discounts d
    WHERE d.discount_id = get_eligible_items.discount_id;

    -- Check the discount type and get eligible items accordingly
    RETURN QUERY
    WITH subcategory_sales AS (
        SELECT i.subcategory_id, SUM(CASE WHEN i.status = 'sold' AND id.discount_id = get_eligible_items.discount_id THEN i.price ELSE 0 END) AS discounted_sales,
               SUM(CASE WHEN i.status = 'sold' AND id.discount_id IS NULL THEN i.price ELSE 0 END) AS non_discounted_sales
        FROM items i
        LEFT JOIN item_discounts id ON i.item_id = id.item_id
        WHERE i.category_id = cat_id
        GROUP BY i.subcategory_id
    ),
    top_subcategories AS (
        SELECT subcategory_id
        FROM subcategory_sales
        WHERE discounted_sales > non_discounted_sales
        ORDER BY discounted_sales DESC
        LIMIT 3
    )
    SELECT i.item_id
    FROM items i
    WHERE i.subcategory_id IN (SELECT subcategory_id FROM top_subcategories);
END;
$$;

CREATE OR REPLACE FUNCTION update_item_discounts()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Insert new item_discounts records for eligible items
    FOR CAT_ID IN (SELECT DISTINCT category_id FROM items)
    LOOP
        INSERT INTO item_discounts (item_id, discount_id)
        SELECT item_id, NEW.discount_id
        FROM get_eligible_items(NEW.discount_id, CAT_ID);
    END LOOP;
    RETURN NEW;
END;
$$;

CREATE TRIGGER update_item_discounts_trigger
AFTER INSERT ON discounts
FOR EACH ROW
EXECUTE FUNCTION update_item_discounts(); 