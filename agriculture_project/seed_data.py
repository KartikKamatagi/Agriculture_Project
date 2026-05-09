import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agriculture_project.settings')
django.setup()

from marketplace.models import Category, Product
from users.models import User
from django.core.files.base import ContentFile

def seed():
    print("Seeding data...")

    # 1. Create Categories
    categories_data = [
        {'name': 'Vegetables', 'slug': 'vegetables', 'description': 'Fresh organic vegetables'},
        {'name': 'Fruits', 'slug': 'fruits', 'description': 'Sweet and ripe seasonal fruits'},
        {'name': 'Grains', 'slug': 'grains', 'description': 'High quality grains and pulses'},
        {'name': 'Dairy', 'slug': 'dairy', 'description': 'Farm fresh milk and dairy products'},
    ]

    for cat_data in categories_data:
        Category.objects.get_or_create(slug=cat_data['slug'], defaults=cat_data)

    # 2. Create Users
    farmer, created = User.objects.get_or_create(
        username='farmer_john',
        defaults={
            'email': 'john@farm.com',
            'is_farmer': True,
            'is_customer': False,
            'phone_number': '1234567890',
            'address': '123 Green Valley Farm, CA'
        }
    )
    if created:
        farmer.set_password('password123')
        farmer.save()

    customer, created = User.objects.get_or_create(
        username='customer_amy',
        defaults={
            'email': 'amy@market.com',
            'is_farmer': False,
            'is_customer': True,
            'phone_number': '0987654321',
            'address': '456 City Center Apt, CA'
        }
    )
    if created:
        customer.set_password('password123')
        customer.save()

    # 3. Create Products
    veg_cat = Category.objects.get(slug='vegetables')
    grain_cat = Category.objects.get(slug='grains')
    fruit_cat = Category.objects.get(slug='fruits')
    dairy_cat = Category.objects.get(slug='dairy')

    products_data = [
        {
            'farmer': farmer,
            'category': veg_cat,
            'name': 'Organic Red Tomatoes',
            'description': 'Vine-ripened organic tomatoes, juicy and perfect for salads.',
            'price': 2.50,
            'quantity_available': 50,
        },
        {
            'farmer': farmer,
            'category': grain_cat,
            'name': 'Premium Golden Wheat',
            'description': 'Hand-picked golden wheat grains, rich in nutrients.',
            'price': 15.00,
            'quantity_available': 100,
        },
        {
            'farmer': farmer,
            'category': fruit_cat,
            'name': 'Sweet Alphonso Mangoes',
            'description': 'The king of fruits! Sweet, aromatic, and delicious.',
            'price': 12.00,
            'quantity_available': 30,
        },
        {
            'farmer': farmer,
            'category': dairy_cat,
            'name': 'Farm Fresh Cow Milk',
            'description': 'Pure, unadulterated milk delivered directly from our farm.',
            'price': 4.00,
            'quantity_available': 40,
        }
    ]

    for prod_data in products_data:
        Product.objects.get_or_create(name=prod_data['name'], defaults=prod_data)

    print("Seeding complete.")

if __name__ == '__main__':
    seed()
