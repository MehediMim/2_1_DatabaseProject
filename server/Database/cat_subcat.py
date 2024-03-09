import psycopg2

conn = psycopg2.connect(
    dbname="e_commerce",
    user="postgres",
    password="harry",
    host="localhost",
    port="5432"
)
cur = conn.cursor()
cur.execute("SELECT category_id, array_agg(name) FROM subcategories GROUP BY category_id")
category_subcategories = cur.fetchall()
subcategories_dict = {row[0]: row[1] for row in category_subcategories}
max_category_id = max(subcategories_dict.keys())
subcategories_2d_array = [subcategories_dict.get(i, None) for i in range(1, max_category_id + 1)]
