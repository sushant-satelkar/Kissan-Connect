"""
Test script for the KisaanConnect API
Run this script after starting the server to test various API endpoints
"""

import requests
import json
import uuid

# Base URL
BASE_URL = "http://localhost:8000"

def test_health():
    """Test the health endpoint"""
    response = requests.get(f"{BASE_URL}/health")
    print("Health check:", response.json())
    print()

def test_farmer_dashboard():
    """Test the farmer dashboard endpoints"""
    print("===== TESTING FARMER DASHBOARD =====")
    
    # Get all crops
    response = requests.get(f"{BASE_URL}/farmer")
    print("All crops:", response.json()[:2])  # Show just the first 2 crops
    
    # Add a new crop
    new_crop = {
        "name": "Carrots",
        "quantity": 75.5,
        "unit": "kg",
        "price_per_unit": 28.5,
        "description": "Fresh organic carrots",
        "location": "Karnataka",
        "available": True
    }
    
    response = requests.post(f"{BASE_URL}/farmer", json=new_crop)
    created_crop = response.json()
    print("Created crop:", created_crop)
    
    # Get dashboard stats
    response = requests.get(f"{BASE_URL}/farmer/dashboard/stats")
    print("Farmer dashboard stats:", response.json())
    print()

def test_consumer_dashboard():
    """Test the consumer dashboard endpoints"""
    print("===== TESTING CONSUMER DASHBOARD =====")
    
    # Get marketplace products
    response = requests.get(f"{BASE_URL}/consumer/marketplace")
    products = response.json()
    print(f"Marketplace products: {len(products)} products available")
    
    if not products:
        print("No products available in marketplace")
        return
    
    # Create a cart
    cart_id = str(uuid.uuid4())
    print(f"Created cart with ID: {cart_id}")
    
    # Add item to cart
    cart_item = {
        "crop_id": products[0]["id"],
        "quantity": 5,
        "cart_id": cart_id,
        "unit_price": products[0]["price_per_unit"]
    }
    
    response = requests.post(f"{BASE_URL}/consumer/cart", json=cart_item)
    added_item = response.json()
    print("Added item to cart:", added_item)
    
    # Get cart items
    response = requests.get(f"{BASE_URL}/consumer/cart/{cart_id}")
    print("Cart items:", response.json())
    
    # Create an order
    order = {
        "total_amount": added_item["quantity"] * added_item["unit_price"],
        "status": "pending",
        "shipping_address": "123 Test Street, Test City",
        "items": [added_item]
    }
    
    response = requests.post(f"{BASE_URL}/consumer/orders", json=order)
    created_order = response.json()
    print("Created order:", created_order)
    
    # Get dashboard stats
    response = requests.get(f"{BASE_URL}/consumer/dashboard/stats")
    print("Consumer dashboard stats:", response.json())
    print()

if __name__ == "__main__":
    # Run all tests
    test_health()
    test_farmer_dashboard()
    test_consumer_dashboard()
    
    print("All tests completed!") 