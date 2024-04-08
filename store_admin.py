import pprint
from pymongo import MongoClient


conn_str = 'mongodb+srv://store_admin:store_admin@dev.3xi1jux.mongodb.net/?retryWrites=true&w=majority&appName=dev'

# Connect to MongoDB
client = MongoClient(conn_str)

db = client['order_system']
orders_collection = db['orders']

#should fail   
try: 
    orders = orders_collection.find({})
    print(list(orders))
except Exception as e:
    print("\nWe are unable to search orders. You should only be looking at store picks")
    pprint.pprint(e)
    print("\n\n")

picks_view = db['failed_picks']
store_id = 1
failed_picks = picks_view.find({"store_id" : store_id})
for pick in failed_picks: 
    
    pprint.pprint(pick)
