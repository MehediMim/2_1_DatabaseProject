

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








INSERT INTO items (user_id, category_id, subcategory_id, name, description, image, price, status) VALUES
  (1, 1, 1, 'Samsung Galaxy S21', 'Latest model with 5G connectivity.', 'url_to_samsung_galaxy_s21_image.jpg', 999, 'Available'),
  (2, 2, 7, 'Dyson V11 Vacuum Cleaner', 'Powerful suction, cord-free vacuum.', 'url_to_dyson_v11_image.jpg', 599, 'Sold'),
  (3, 3, 3, 'Oak Wood Dining Table', 'Elegant dining table made from oak wood.', 'url_to_dining_table_image.jpg', 450, 'Available'),
  (4, 4, 2, 'Levi''s Denim Jacket', 'Stylish denim jacket for men.', 'url_to_denim_jacket_image.jpg', 120, 'Available'),
  (5, 5, 1, 'Maxi Dress Floral Print', 'Beautiful floral print maxi dress for women.', 'url_to_maxi_dress_image.jpg', 89, 'Pending'),
  (6, 6, 1, 'Golden Retriever Puppy', 'Adorable golden retriever puppy, 8 weeks old.', 'url_to_puppy_image.jpg', 300, 'Available'),
  (7, 7, 2, 'Adidas Running Shoes', 'High-performance running shoes for athletes.', 'url_to_running_shoes_image.jpg', 110, 'Available'),
  (8, 8, 1, 'Office Desk Chairs', 'Ergonomic office chairs for productivity.', 'url_to_office_chair_image.jpg', 200, 'Sold'),
  (9, 9, 1, 'Physics Textbook', 'Comprehensive physics textbook for undergraduates.', 'url_to_physics_textbook_image.jpg', 60, 'Available'),
  (10, 10, 2, 'Organic Vegetables Box', 'A box of fresh, organic vegetables.', 'url_to_vegetables_box_image.jpg', 30, 'Available'),
  (11, 11, 1, 'High-Quality Seeds', 'Seeds for various vegetables and fruits.', 'url_to_seeds_image.jpg', 15, 'Available'),
  (12, 1, 1, 'iPhone 12', 'A14 Bionic chip, 5G speed.', 'image_iphone12.jpg', 799, 'Available'),
  (13, 2, 8, 'Canon EOS R5', 'High-resolution mirrorless camera.', 'image_canonEOSR5.jpg', 3899, 'Available'),
  (14, 3, 3, 'Solid Wood Bed Frame', 'Queen size bed frame made from solid wood.', 'image_bedFrame.jpg', 450, 'Sold'),
  (15, 4, 10, 'Seiko Automatic Watch', 'Stainless steel watch with see-through back.', 'image_seikoWatch.jpg', 525, 'Available'),
  (16, 5, 7, 'Skin Care Set', 'Complete skincare routine package.', 'image_skincareSet.jpg', 120, 'Available'),
  (17, 6, 1, 'Aquarium Set', '20-gallon fish tank with filter and lights.', 'image_aquarium.jpg', 150, 'Available'),
  (18, 7, 2, 'Golf Clubs Set', 'Full set of irons and woods, bag included.', 'image_golfClubs.jpg', 780, 'Pending'),
  (19, 8, 4, '3D Printer', 'High precision 3D printer for professional use.', 'image_3dPrinter.jpg', 1200, 'Available'),
  (20, 9, 1, 'Calculus Textbook', 'Comprehensive guide to calculus.', 'image_calculusBook.jpg', 95, 'Available'),
  (21, 10, 3, 'Fresh Salmon Fillet', 'Wild-caught salmon, 2 lbs.', 'image_salmonFillet.jpg', 22, 'Available'),
  (22, 11, 2, 'Gardening Tool Set', 'Essential tools for gardening enthusiasts.', 'image_gardeningTools.jpg', 75, 'Sold'),
  (23, 2, 11, 'Gaming Console', 'Latest gaming console with two controllers.', 'image_gamingConsole.jpg', 500, 'Available'),
  (24, 3, 5, 'Modern Lamp', 'LED lamp with adjustable brightness.', 'image_modernLamp.jpg', 89, 'Available'),
  (25, 4, 1, 'Running Shoes', 'Lightweight running shoes for men.', 'image_runningShoes.jpg', 110, 'Available'),
  (26, 5, 5, 'Heels', 'Elegant high heels in black.', 'image_heels.jpg', 130, 'Available'),
  (27, 6, 3, 'Cat Tree', 'Multi-level cat tree with scratching posts.', 'image_catTree.jpg', 60, 'Pending');


INSERT INTO items (user_id, category_id, subcategory_id, name, description, image, price, status) VALUES
  (28, 7, 4, 'Mountain Bike', 'Durable mountain bike designed for off-road cycling.', 'url_to_mountain_bike_image.jpg', 480, 'Available'),
  (29, 8, 3, 'Industrial Drill', 'High-power industrial drill for construction projects.', 'url_to_industrial_drill_image.jpg', 320, 'Sold'),
  (30, 9, 2, 'Chemistry Set', 'Complete chemistry set for educational purposes.', 'url_to_chemistry_set_image.jpg', 50, 'Available'),
  (31, 10, 4, 'Baby Stroller', 'Comfortable and safe baby stroller for your little ones.', 'url_to_baby_stroller_image.jpg', 150, 'Pending'),
  (32, 11, 3, 'Tractor', 'Efficient tractor for agricultural use.', 'url_to_tractor_image.jpg', 10000, 'Available'),
  (33, 12, 2, 'Electric Scooter', 'Eco-friendly electric scooter for urban commuting.', 'url_to_electric_scooter_image.jpg', 250, 'Available'),
  (34, 13, 8, 'Office Space for Rent', 'Spacious and well-located office space for rent.', 'url_to_office_space_image.jpg', 2000, 'Available'),
  (35, 14, 11, 'Resume Writing Services', 'Professional resume writing services to boost your job search.', 'url_to_resume_service_image.jpg', 100, 'Available'),
  (36, 15, 19, 'Marketing Manager Position', 'Seeking a creative and experienced marketing manager.', 'url_to_job_listing_image.jpg', 0, 'Available'),
  (37, 16, 22, 'Camping Tent', 'Spacious and durable camping tent for outdoor adventures.', 'url_to_camping_tent_image.jpg', 120, 'Sold'),
  (38, 17, 26, 'Classic Novel Collection', 'A collection of classic novels in excellent condition.', 'url_to_novel_collection_image.jpg', 60, 'Available'),
  (39, 18, 31, 'Vintage Watch', 'Elegant vintage watch in mint condition.', 'url_to_vintage_watch_image.jpg', 350, 'Pending'),
  (40, 19, 35, 'Yoga Mat', 'Eco-friendly yoga mat for your fitness routine.', 'url_to_yoga_mat_image.jpg', 25, 'Available'),
  (41, 20, 40, 'Toolbox Set', 'Complete set of tools for DIY projects and repairs.', 'url_to_toolbox_set_image.jpg', 90, 'Available'),
  (42, 21, 45, 'Wedding Photography Package', 'Professional wedding photography package to capture your special day.', 'url_to_wedding_photography_image.jpg', 1500, 'Available'),
  (43, 22, 50, 'Modern Sofa', 'Stylish and comfortable modern sofa for your living room.', 'url_to_modern_sofa_image.jpg', 700, 'Sold'),
  (44, 23, 55, 'Blender', 'High-speed blender for smoothies and soups.', 'url_to_blender_image.jpg', 120, 'Available'),
  (45, 24, 60, 'Bath Towel Set', 'Soft and absorbent bath towel set.', 'url_to_bath_towel_set_image.jpg', 40, 'Pending'),
  (46, 25, 65, 'Outdoor Grill', 'High-quality outdoor grill for BBQs and gatherings.', 'url_to_outdoor_grill_image.jpg', 300, 'Available'),
  (47, 26, 95, 'Gaming PC', 'High-performance gaming PC with the latest specs.', 'url_to_gaming_pc_image.jpg', 1500, 'Available'),
  (48, 27, 100, 'Wireless Charger', 'Fast and convenient wireless charger for smartphones.', 'url_to_wireless_charger_image.jpg', 30, 'Sold'),
  (49, 28, 105, 'DSLR Camera', 'Professional DSLR camera for photography enthusiasts.', 'url_to_dslr_camera_image.jpg', 800, 'Available'),
  (50, 29, 110, 'Fitness Tracker', 'Accurate and versatile fitness tracker for all your activities.', 'url_to_fitness_tracker_image.jpg', 100, 'Available'),
  (51, 30, 115, 'Acoustic Guitar', 'Beautiful acoustic guitar with rich sound.', 'url_to_acoustic_guitar_image.jpg', 200, 'Pending'),
  (52, 31, 120, 'Chess Set', 'Handcrafted chess set for enthusiasts and collectors.', 'url_to_chess_set_image.jpg', 150, 'Available'),
  (53, 32, 125, 'Lego Building Set', 'Creative and fun Lego building set for kids.', 'url_to_lego_set_image.jpg', 60, 'Available'),
  (54, 33, 130, 'Sewing Machine', 'Compact and easy-to-use sewing machine for home projects.', 'url_to_sewing_machine_image.jpg', 100, 'Sold'),
  (55, 34, 135, 'Dog Food', 'Nutritious dog food for healthy and happy pets.', 'url_to_dog_food_image.jpg', 45, 'Available'),
  (56, 35, 140, 'Desk Organizer', 'Keep your desk tidy with this stylish desk organizer.', 'url_to_desk_organizer_image.jpg', 25, 'Pending'),
  (57, 36, 145, 'Facial Cleanser', 'Gentle facial cleanser suitable for all skin types.', 'url_to_facial_cleanser_image.jpg', 15, 'Available');

INSERT INTO items (user_id, category_id, subcategory_id, name, description, image, price, status) VALUES
  (51, 30, 115, 'Acoustic Guitar', 'High-quality acoustic guitar with rich tones.', 'url_to_acoustic_guitar_image.jpg', 300, 'Available'),
  (52, 31, 120, 'Strategy Board Game', 'Engaging strategy board game for all ages.', 'url_to_board_game_image.jpg', 50, 'Sold'),
  (53, 32, 125, 'LEGO Building Set', 'Creative LEGO building set for kids.', 'url_to_lego_set_image.jpg', 60, 'Available'),
  (54, 33, 130, 'Crafting Kit', 'Comprehensive crafting kit with various materials.', 'url_to_crafting_kit_image.jpg', 45, 'Pending'),
  (55, 34, 135, 'Dog Food', 'Nutritious dog food for healthy pets.', 'url_to_dog_food_image.jpg', 25, 'Available'),
  (56, 35, 140, 'Ergonomic Keyboard', 'Comfortable ergonomic keyboard for long hours of typing.', 'url_to_ergonomic_keyboard_image.jpg', 70, 'Available'),
  (57, 36, 145, 'Face Serum', 'Revitalizing face serum for all skin types.', 'url_to_face_serum_image.jpg', 80, 'Sold'),
  (58, 37, 150, 'Organic Honey', 'Pure organic honey from local farms.', 'url_to_organic_honey_image.jpg', 15, 'Available'),
  (59, 38, 155, 'Craft Beer Collection', 'Assorted craft beer collection from various breweries.', 'url_to_craft_beer_image.jpg', 40, 'Pending'),
  (60, 39, 160, 'Gourmet Chocolate Box', 'Selection of gourmet chocolates in a luxury box.', 'url_to_chocolate_box_image.jpg', 30, 'Available'),
  (61, 40, 165, 'Blood Pressure Monitor', 'Accurate blood pressure monitor for home use.', 'url_to_blood_pressure_monitor_image.jpg', 75, 'Available'),
  (62, 41, 170, 'Infant Formula', 'High-quality infant formula for newborns.', 'url_to_infant_formula_image.jpg', 20, 'Sold'),
  (63, 1, 3, 'Fitness Smartwatch', 'Water-resistant fitness smartwatch with GPS.', 'url_to_fitness_smartwatch_image.jpg', 199, 'Available'),
  (64, 2, 9, 'Electric Kettle', 'Fast-boiling electric kettle with temperature control.', 'url_to_electric_kettle_image.jpg', 45, 'Available'),
  (65, 3, 8, 'Decorative Vases', 'Set of decorative vases for modern home decor.', 'url_to_decorative_vases_image.jpg', 70, 'Pending'),
  (66, 4, 6, 'Mens Grooming Kit', 'Complete mens grooming kit with all essentials.', 'url_to_mens_grooming_kit_image.jpg', 55, 'Available'),
  (67, 5, 8, 'Cosmetic Organizer', 'Chic cosmetic organizer for makeup enthusiasts.', 'url_to_cosmetic_organizer_image.jpg', 25, 'Sold'),
  (68, 6, 4, 'Bird Cage', 'Spacious bird cage suitable for multiple birds.', 'url_to_bird_cage_image.jpg', 100, 'Available'),
  (69, 7, 5, 'Childrens Book Collection', 'Educational and fun childrens book collection.', 'url_to_childrens_book_collection_image.jpg', 80, 'Available'),
  (70, 8, 2, 'Safety Helmets', 'Industrial-grade safety helmets for construction.', 'url_to_safety_helmets_image.jpg', 30, 'Pending'),
  (71, 9, 1, 'Mathematics Tutoring Services', 'Expert mathematics tutoring for all levels.', 'url_to_tutoring_services_image.jpg', 25, 'Available'),
  (72, 10, 6, 'Eco-Friendly Cleaning Products', 'Set of eco-friendly cleaning products for the household.', 'url_to_cleaning_products_image.jpg', 20, 'Sold'),
  (73, 11, 2, 'Irrigation System', 'Efficient irrigation system for agriculture.', 'url_to_irrigation_system_image.jpg', 250, 'Available'),
  (74, 12, 3, 'Folding Bicycle', 'Compact folding bicycle for urban commuters.', 'url_to_folding_bicycle_image.jpg', 350, 'Available'),
  (75, 13, 7, 'Studio Apartment for Sale', 'Cozy studio apartment in a prime location.', 'url_to_studio_apartment_image.jpg', 100000, 'Sold'),
  (76, 14, 13, 'Hair Salon Services', 'Professional hair salon services for all types.', 'url_to_hair_salon_image.jpg', 50, 'Available'),
  (77, 15, 17, 'Graphic Designer Wanted', 'Creative graphic designer wanted for dynamic projects.', 'url_to_graphic_designer_image.jpg', 0, 'Pending'),
  (78, 16, 21, 'Hiking Backpack', 'Durable hiking backpack for outdoor enthusiasts.', 'url_to_hiking_backpack_image.jpg', 90, 'Available'),
  (79, 17, 26, 'Vinyl Record Collection', 'Classic vinyl record collection from various artists.', 'url_to_vinyl_record_image.jpg', 200, 'Sold'),
  (80, 18, 32, 'Handmade Pottery', 'Beautiful handmade pottery pieces.', 'url_to_handmade_pottery_image.jpg', 60, 'Available'),
  (81, 19, 36, 'Aromatherapy Diffuser', 'Ultrasonic aromatherapy diffuser for essential oils.', 'url_to_aromatherapy_diffuser_image.jpg', 40, 'Pending'),
  (82, 20, 41, 'Cordless Drill', 'Powerful cordless drill with multiple drill bits.', 'url_to_cordless_drill_image.jpg', 110, 'Available'),
  (83, 21, 45, 'Event Planning Services', 'Comprehensive event planning services for all occasions.', 'url_to_event_planning_services_image.jpg', 500, 'Sold'),
  (84, 22, 51, 'Wall Art', 'Contemporary wall art to enhance your home decor.', 'url_to_wall_art_image.jpg', 150, 'Available'),
  (85, 23, 55, 'Espresso Machine', 'High-end espresso machine for coffee enthusiasts.', 'url_to_espresso_machine_image.jpg', 700, 'Pending'),
  (86, 24, 60, 'Luxury Bathrobe', 'Soft and luxurious bathrobe for ultimate comfort.', 'url_to_luxury_bathrobe_image.jpg', 100, 'Available'),
  (87, 25, 65, 'Patio Heater', 'Outdoor patio heater for chilly evenings.', 'url_to_patio_heater_image.jpg', 150, 'Sold'),
  (88, 26, 95, 'Wireless Mouse', 'Ergonomic wireless mouse for computers and laptops.', 'url_to_wireless_mouse_image.jpg', 25, 'Available'),
  (89, 27, 100, 'Smartphone Screen Protector', 'Durable screen protector for smartphones.', 'url_to_screen_protector_image.jpg', 10, 'Pending'),
  (90, 28, 105, 'Video Camera', 'High-definition video camera for filmmaking.', 'url_to_video_camera_image.jpg', 1000, 'Available'),
  (91, 29, 110, 'Yoga Pants', 'Comfortable and flexible yoga pants for women.', 'url_to_yoga_pants_image.jpg', 35, 'Sold'),
  (92, 30, 115, 'Electric Piano', 'Full-sized electric piano with weighted keys.', 'url_to_electric_piano_image.jpg', 600, 'Available'),
  (93, 31, 120, 'Puzzle Game', 'Challenging puzzle game for brain exercise.', 'url_to_puzzle_game_image.jpg', 20, 'Pending'),
  (94, 32, 125, 'Action Figure', 'Collectible action figure from popular series.', 'url_to_action_figure_image.jpg', 75, 'Available'),
  (95, 33, 130, 'Embroidery Kit', 'Complete embroidery kit with patterns and threads.', 'url_to_embroidery_kit_image.jpg', 30, 'Sold'),
  (96, 34, 135, 'Cat Litter', 'High-absorbency cat litter for odor control.', 'url_to_cat_litter_image.jpg', 15, 'Available'),
  (97, 35, 140, 'Stationery Set', 'Designer stationery set for office and personal use.', 'url_to_stationery_set_image.jpg', 20, 'Pending'),
  (98, 36, 145, 'Lipstick Collection', 'Vibrant lipstick collection for every occasion.', 'url_to_lipstick_collection_image.jpg', 50, 'Available'),
  (99, 37, 150, 'Spices Set', 'Assorted spices set for culinary enthusiasts.', 'url_to_spices_set_image.jpg', 25, 'Sold'),
  (100, 38, 155, 'Tea Sampler', 'Exquisite tea sampler with varieties from around the world.', 'url_to_tea_sampler_image.jpg', 35, 'Available');
