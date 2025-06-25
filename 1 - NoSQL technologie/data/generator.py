import json
import os
from faker import Faker
import random
from datetime import datetime, timedelta

fake = Faker()

# Generate products with varying attributes
def generate_products(num=200):
    products = []
    categories = ['Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Toys']
    
    for i in range(1, num + 1):
        category = random.choice(categories)
        attributes = {}
        
        if category == 'Electronics':
            attributes = {
                'brand': fake.company(),
                'warranty': f"{random.randint(1, 3)} years",
                'voltage': f"{random.choice([110, 220])}V"
            }
        elif category == 'Clothing':
            attributes = {
                'size': random.choice(['S', 'M', 'L', 'XL']),
                'color': fake.color_name(),
                'material': random.choice(['Cotton', 'Polyester', 'Wool'])
            }
        elif category == 'Home & Kitchen':
            attributes = {
                'material': random.choice(['Wood', 'Stainless Steel', 'Ceramic']),
                'weight': f"{random.uniform(0.5, 15.0):.1f} kg"
            }
        
        products.append({
            '_id': i,
            'name': fake.word().capitalize() + ' ' + fake.word().capitalize(),
            'price': round(random.uniform(10, 500), 2),
            'category': category,
            'attributes': attributes,
            'last_updated': fake.date_time_this_year().isoformat()
        })
    
    return products

# Generate users with a single address and preferences
def generate_users(num=200):
    users = []
    for i in range(1, num + 1):
        users.append({
            '_id': i,
            'name': fake.name(),
            'email': fake.email(),
            'age': random.randint(18, 80),
            'address': {
                'street': fake.street_address(),
                'city': fake.city(),
                'state': fake.state_abbr(),
                'zipcode': fake.zipcode(),
                'country': fake.country()
            },
            'preferences': {
                'newsletter': random.choice([True, False]),
                'theme': random.choice(['light', 'dark']),
                'notifications': {
                    'email': random.choice([True, False]),
                    'sms': random.choice([True, False])
                }
            },
            'created_at': fake.date_time_this_year().isoformat()
        })
    return users

# Generate orders with nested line items
def generate_orders(num=500):
    orders = []
    for i in range(1, num + 1):
        order_date = fake.date_time_this_year()
        items = []
        for _ in range(random.randint(1, 5)):
            items.append({
                'product_id': random.randint(1, 200),
                'quantity': random.randint(1, 5),
                'price': round(random.uniform(10, 500), 2)
            })
        
        orders.append({
            '_id': i,
            'user_id': random.randint(1, 200),
            'items': items,
            'total': round(sum(item['price'] * item['quantity'] for item in items), 2),
            'status': random.choice(['pending', 'shipped', 'delivered', 'cancelled']),
            'order_date': order_date.isoformat(),
            'shipping_address': {
                'street': fake.street_address(),
                'city': fake.city(),
                'state': fake.state_abbr(),
                'zipcode': fake.zipcode(),
                'country': fake.country()
            }
        })
    return orders

if __name__ == '__main__':
    # Get the directory of the current script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Generate and save data in the same directory as the script
    with open(os.path.join(script_dir, 'products.json'), 'w') as f:
        json.dump(generate_products(), f, indent=2)
    
    with open(os.path.join(script_dir, 'users.json'), 'w') as f:
        json.dump(generate_users(), f, indent=2)
    
    with open(os.path.join(script_dir, 'orders.json'), 'w') as f:
        json.dump(generate_orders(), f, indent=2)

    print("Generated 3 data files in", script_dir)
