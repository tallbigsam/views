import random
from pymongo import MongoClient
from datetime import datetime, timedelta

conn_str = 'mongodb+srv://main_user:main_user@dev.3xi1jux.mongodb.net/?retryWrites=true&w=majority&appName=dev'

# Connect to MongoDB
client = MongoClient(conn_str)

db = client['order_system']
orders_collection = db['orders']

orders_collection.delete_many({})

# Batch the inserts
batch_size = 1000
batch = []

def generate_line_items(num_items):
    line_items = []
    for i in range(num_items):
        line_item = {
            'product_line': random.choice(['GM', 'Produce', 'Dairy', 'Frozen', 'Bakery', 'Meat']),
            'quantity': random.randint(1, 10),
            'SKU': random.randint(1, 1000),
        }
        line_items.append(line_item)
    return line_items

for i in range(10000):

    line_items = generate_line_items(random.randint(1, 10))
    # magic number on the store_id ------ OR IS IT????
    # 2545 "stores" total
    # 317 pfs
    # 68 restaurants
    # 426 argos
    # 2 pharmacy
    # 73 specsavers
    # 225 tm's
    # 830 local
    # 604 mains

    
    order = {
        'order_id': i + 1,
        'store_id': random.randint(1, 604),
        'order_time': datetime.now() - timedelta(minutes=random.randint(1, 1440)),
        'expected_delivery_time': datetime.now() + timedelta(minutes=random.randint(1440, 2880)),
        'picked': random.choice([True, False]),
        'error_picking': random.choice([True, False]),
        'customer_id': random.randint(1,8000),
        'line_items': line_items,
    }
    batch.append(order)

    # Insert the batch when it reaches the desired size
    if len(batch) == batch_size:
        orders_collection.insert_many(batch)
        batch = []

# Insert any remaining orders in the batch
if batch:
    orders_collection.insert_many(batch)

# Close the MongoDB connection
client.close()