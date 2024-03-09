import sqlite3

# Connect to your SQLite database
conn = sqlite3.connect('e_commerce.db')
c = conn.cursor()

# Execute your SQL query
c.execute("SELECT category_id, subcategory_id FROM subcategories")

# Fetch all rows from the query
rows = c.fetchall()

# Create a dictionary where each category id maps to a list of subcategory ids
category_dict = {}
for row in rows:
    category_id, subcategory_id = row
    if category_id not in category_dict:
        category_dict[category_id] = []
    category_dict[category_id].append(subcategory_id)

# Convert the dictionary to a 2D array
array = list(category_dict.values())