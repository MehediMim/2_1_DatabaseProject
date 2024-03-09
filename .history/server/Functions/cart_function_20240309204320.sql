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
    v_item cart_item_type;
    i INT;
BEGIN
    INSERT INTO orders (user_id, total_price, status)
    VALUES (p_user_id, p_total_price, 'placed')
    RETURNING order_id INTO v_order_id;

    FOR i IN 1..array_length(p_cart_items, 1) LOOP
        v_item := p_cart_items[i];
        INSERT INTO order_details (order_id, item_id, quantity, price)
        VALUES (v_order_id, v_item.item_id, v_item.quantity, v_item.price);
    END LOOP;


    INSERT INTO shipping_info 
    (order_id, address_line1, address_line2, city, division, zip_code, shipping_date)
    VALUES 
    (v_order_id, p_address_line1, p_address_line2, p_city, p_division, p_zip_code, p_shipping_date);


    INSERT INTO payments (order_id, user_id, amount, payment_method)
    VALUES (v_order_id, p_user_id, p_amount, p_payment_method);


    IF p_payment_method = 'Credit Card' THEN
        INSERT INTO card_info 
        (user_id, card_number, card_holder_name, expiry_month, expiry_year, cvv)
        VALUES 
        (p_user_id, p_card_number, p_card_holder_name, p_expiry_month, p_expiry_year, p_cvv);
    END IF;
    DELETE FROM cart WHERE user_id = p_user_id;

    RETURN v_order_id; 
EXCEPTION
    WHEN OTHERS THEN

        RAISE;
END;
$$ LANGUAGE plpgsql;
