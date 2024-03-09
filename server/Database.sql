-- Create the e_commerce database
CREATE DATABASE e_commerce;

-- Add the pgcrypto extension to the database
CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- USER TABLE

 CREATE SEQUENCE user_id_seq
START WITH 1000
INCREMENT BY 1;
CREATE TABLE users (
    user_id INT NOT NULL DEFAULT nextval('users_user_id_seq') PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(30) UNIQUE,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    CHECK (phone_number IS NOT NULL OR email IS NOT NULL)
);

--phone number is a multivalued attribute so another table was needed to maintain the first normal form
-- Table for User Phone Numbers
CREATE TABLE user_phone_number (
    user_id INT NOT NULL UNIQUE,
    phone_number VARCHAR(30) UNIQUE,
    PRIMARY KEY (user_id, phone_number)
);



CREATE SEQUENCE items_item_id_seq START 1;
CREATE TABLE items (
    item_id INT  DEFAULT nextval('items_item_id_seq') PRIMARY KEY,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    subcategory_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image TEXT ,
    price DECIMAL(10, 0) NOT NULL CHECK (price >= 0),
    status VARCHAR(50),
    date_Posted TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);



SELECT setval('items_item_id_seq', COALESCE((SELECT MAX(item_id) FROM items), 1), false);

--for category

CREATE TABLE categories (
    category_id INT  PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL
);


--for subcategory

CREATE TABLE subcategories (
    subcategory_id INT NOT NULL,
    category_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY (category_id, subcategory_id),
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

CREATE TABLE images (
    image_id SERIAL,
    item_id INT NOT NULL,
    image_url TEXT NOT NULL,
    PRIMARY KEY (image_id, item_id),
    FOREIGN KEY (item_id) REFERENCES items(item_id)
);

--for discount
CREATE TYPE discount_type AS ENUM (
  'free shipping',
  'fixed amount discount',
  'percentage discount',
  'buy x get y free',
  'guarantee',
  'cashback'
);

CREATE SEQUENCE discounts_discount_id_seq START WITH 1;

CREATE TABLE discounts (
    discount_id INT DEFAULT nextval('discounts_discount_id_seq') PRIMARY KEY,
    type discount_type NOT NULL,
    description TEXT,
    start_date TIMESTAMP WITH TIME ZONE  DEFAULT CURRENT_TIMESTAMP,
    duration INT NOT NULL CHECK (duration >= 0)
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



--for message 
-- Table for Messages

DROP TABLE IF EXISTS messages;

CREATE TABLE messages(
    message_id SERIAL PRIMARY KEY,
    user_id_sender INT NOT NULL,
    user_id_receiver INT NOT NULL,
    message TEXT,            
    message_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id_sender) REFERENCES users(user_id),
    FOREIGN KEY (user_id_receiver) REFERENCES users(user_id)
);

--for reporting 
CREATE TABLE report(
    user_id INT NOT NULL,
    item_id INT NOT NULL,
    description TEXT,
    date_posted TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, item_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (item_id) REFERENCES items(item_id)
);


--FOR REVIEWS
CREATE TABLE reviews(
    user_id INT NOT NULL,
    item_id INT NOT NULL,
    content TEXT,
    star_rating INT CHECK (star_rating >= 1 AND star_rating <= 5), 
    upvotes INT DEFAULT 0,
    downvotes INT DEFAULT 0,
    date_posted TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, item_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (item_id) REFERENCES items(item_id)
);

CREATE TYPE order_status AS ENUM ('placed', 'confirmed', 'shipped', 'delivered', 'cancelled');

CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),      
    total_price DECIMAL(10) NOT NULL CHECK (total_price >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status order_status NOT NULL DEFAULT 'placed',
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Orders Table
CREATE TABLE order_details (
    order_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0), -- Consider changing >= 0 to > 0 to ensure at least one item
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0), -- Adjust for cents and consistency with orders.total_price
    PRIMARY KEY (order_id, item_id), -- Composite primary key
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (item_id) REFERENCES items(item_id)
);


CREATE TABLE shipping_info (
    order_id INT NOT NULL REFERENCES orders(order_id),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    division VARCHAR(100),
    zip_code VARCHAR(20),
    shipping_date TIMESTAMP,
    PRIMARY KEY (order_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

CREATE TABLE payments (
    order_id INT REFERENCES orders(order_id),
    user_id INT NOT NULL,
    amount DECIMAL(10, 0) NOT NULL CHECK (amount > 0),
    payment_method VARCHAR(255),
    PRIMARY KEY (order_id, user_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE cart (
    cart_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (item_id) REFERENCES items(item_id),
    UNIQUE(user_id, item_id) -- Ensures that each item appears only once per user's cart
);

CREATE TABLE search_history (
    search_id SERIAL PRIMARY KEY,
    user_id INT,
    search_query TEXT,
    category_name TEXT,
    sort_option TEXT,
    search_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE user_photo (
    user_id INT NOT NULL UNIQUE,
    photo_url TEXT,
    PRIMARY KEY (user_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE card_info (
    card_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    card_number VARCHAR(16), -- Storing only the last 4 digits is recommended
    card_holder_name VARCHAR(255) NOT NULL,
    expiry_month INT CHECK (expiry_month > 0 AND expiry_month <= 12),
    expiry_year INT,
    cvv VARCHAR(4), -- Never store the CVV
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE SEQUENCE discounts_discount_id_seq START 1;
CREATE TYPE discount_type AS ENUM (
  'free shipping',
  'fixed amount discount',
  'percentage discount',
  'buy x get y free',
  'guarantee',
  'cashback'
);

CREATE SEQUENCE discounts_discount_id_seq START WITH 1;

CREATE SEQUENCE discounts_discount_id_seq START 1;


CREATE TABLE discounts (
    discount_id INT DEFAULT nextval('discounts_discount_id_seq') PRIMARY KEY,
    discount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    duration INT NOT NULL CHECK (duration >= 0)            
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

CREATE TABLE discounts (
    discount_id INT DEFAULT nextval('discounts_discount_id_seq') PRIMARY KEY,
    discount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    type VARCHAR(255) NOT NULL, -- Assuming 'type' is intended to be a string, renamed as 'discount_type' for clarity
    description TEXT,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    duration INT NOT NULL CHECK (duration >= 0) -- Ensures duration is non-negative
);
