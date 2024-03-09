CREATE TYPE cart_item_type AS (
    item_id INT,
    quantity INT,
    price DECIMAL
);

CREATE OR REPLACE FUNCTION complete_order_function(
    p_user_id INT,
    p_total_price DECIMAL,
    p_cart_items cart_item_type[],
    p_address_line1 TEXT,
    p_address_line2 TEXT,
    p_city TEXT,
    p_division TEXT,
    p_zip_code TEXT,
    p_shipping_date TIMESTAMP,
    p_amount DECIMAL,
    p_payment_method TEXT,
    p_card_number TEXT,
    p_card_holder_name TEXT,
    p_expiry_month INT,
    p_expiry_year INT,
    p_cvv TEXT
) RETURNS INT AS $$
DECLARE
    v_order_id INT;
    i INT;
BEGIN
    -- Insert the order
    INSERT INTO orders (user_id, total_price, status)
    VALUES (p_user_id, p_total_price, 'placed')
    RETURNING order_id INTO v_order_id;

    -- Process each cart item
    FOR i IN 1..array_length(p_cart_items, 1) LOOP
        INSERT INTO order_details (order_id, item_id, quantity, price)
        VALUES (v_order_id, (p_cart_items[i]).item_id, (p_cart_items[i]).quantity, (p_cart_items[i]).price);
    END LOOP;

    -- Add shipping information, process payment, and handle card information as before

    -- Clear the user's cart
    DELETE FROM cart WHERE user_id = p_user_id;

    RETURN v_order_id; -- Return the order ID
EXCEPTION
    WHEN OTHERS THEN
        RAISE; -- Reraise any caught exception
END;
$$ LANGUAGE plpgsql;
