from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
import sqlite3
import os
from pathlib import Path
import uuid

# Setup router
router = APIRouter()

# Define path for consumer database
DB_DIR = Path(__file__).parent / "data"
DB_PATH = DB_DIR / "consumer.db"

# Make sure the directory exists
os.makedirs(DB_DIR, exist_ok=True)

# Define models
class CartItem(BaseModel):
    id: Optional[int] = None
    crop_id: int
    quantity: float
    cart_id: str
    unit_price: float
    crop_name: Optional[str] = None

class Order(BaseModel):
    id: Optional[int] = None
    consumer_id: Optional[int] = None
    total_amount: float
    status: str = "pending"
    shipping_address: str
    items: List[CartItem] = []

def setup_db():
    """Set up the consumer database"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Create cart items table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS cart_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        crop_id INTEGER NOT NULL,
        quantity REAL NOT NULL,
        cart_id TEXT NOT NULL,
        unit_price REAL NOT NULL,
        crop_name TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    # Create orders table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        consumer_id INTEGER,
        total_amount REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        shipping_address TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    # Create order items table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        crop_id INTEGER NOT NULL,
        quantity REAL NOT NULL,
        unit_price REAL NOT NULL,
        crop_name TEXT,
        FOREIGN KEY (order_id) REFERENCES orders (id)
    )
    ''')
    
    conn.commit()
    conn.close()

# Set up the database on module import
setup_db()

@router.get("/marketplace", response_model=List[dict])
async def get_marketplace_products():
    """Get all products available in the marketplace"""
    # We'll use the farmer's crops database for the marketplace
    farmer_db_path = Path(__file__).parent.parent / "farmer" / "data" / "farmer.db"
    
    if not os.path.exists(farmer_db_path):
        return []
    
    conn = sqlite3.connect(farmer_db_path)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT id, name, quantity, unit, price_per_unit, description, location
        FROM crops 
        WHERE available = 1
        ORDER BY name
    """)
    rows = cursor.fetchall()
    
    conn.close()
    
    return [dict(row) for row in rows]

@router.get("/cart/{cart_id}", response_model=List[CartItem])
async def get_cart_items(cart_id: str):
    """Get all items in a specific cart"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM cart_items WHERE cart_id = ?", (cart_id,))
    rows = cursor.fetchall()
    
    conn.close()
    
    return [dict(row) for row in rows]

@router.post("/cart", response_model=CartItem)
async def add_to_cart(item: CartItem):
    """Add an item to the cart"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Check if the crop exists in the farmer database
    farmer_db_path = Path(__file__).parent.parent / "farmer" / "data" / "farmer.db"
    
    if not os.path.exists(farmer_db_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    farmer_conn = sqlite3.connect(farmer_db_path)
    farmer_cursor = farmer_conn.cursor()
    
    farmer_cursor.execute("SELECT name, price_per_unit FROM crops WHERE id = ?", (item.crop_id,))
    crop = farmer_cursor.fetchone()
    
    if crop is None:
        farmer_conn.close()
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    
    # Use the crop name and price from the farmer database
    crop_name, unit_price = crop
    
    # Generate a cart ID if not provided
    if not item.cart_id:
        item.cart_id = str(uuid.uuid4())
    
    # Check if item already exists in cart
    cursor.execute(
        "SELECT id FROM cart_items WHERE cart_id = ? AND crop_id = ?",
        (item.cart_id, item.crop_id)
    )
    existing_item = cursor.fetchone()
    
    if existing_item:
        # Update quantity of existing item
        cursor.execute(
            "UPDATE cart_items SET quantity = quantity + ? WHERE id = ?",
            (item.quantity, existing_item[0])
        )
        item_id = existing_item[0]
    else:
        # Insert new cart item
        cursor.execute(
            """
            INSERT INTO cart_items (crop_id, quantity, cart_id, unit_price, crop_name)
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                item.crop_id,
                item.quantity,
                item.cart_id,
                unit_price,
                crop_name
            )
        )
        item_id = cursor.lastrowid
    
    conn.commit()
    
    # Get the updated cart item
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM cart_items WHERE id = ?", (item_id,))
    updated_item = dict(cursor.fetchone())
    
    farmer_conn.close()
    conn.close()
    
    return updated_item

@router.delete("/cart/{cart_id}/item/{item_id}")
async def remove_from_cart(cart_id: str, item_id: int):
    """Remove an item from the cart"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Check if item exists
    cursor.execute(
        "SELECT id FROM cart_items WHERE id = ? AND cart_id = ?",
        (item_id, cart_id)
    )
    if cursor.fetchone() is None:
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found in cart"
        )
    
    # Delete the item
    cursor.execute("DELETE FROM cart_items WHERE id = ?", (item_id,))
    conn.commit()
    conn.close()
    
    return {"message": "Item removed from cart"}

@router.post("/orders", response_model=Order)
async def create_order(order: Order):
    """Create a new order from cart items"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    # Ensure there are items in the order
    if not order.items:
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order must have at least one item"
        )
    
    # For demo purposes, use consumer_id 1 if none provided
    consumer_id = order.consumer_id or 1
    
    # Create the order
    cursor.execute(
        """
        INSERT INTO orders (consumer_id, total_amount, status, shipping_address)
        VALUES (?, ?, ?, ?)
        """,
        (
            consumer_id,
            order.total_amount,
            order.status,
            order.shipping_address
        )
    )
    
    order_id = cursor.lastrowid
    
    # Add order items
    for item in order.items:
        cursor.execute(
            """
            INSERT INTO order_items (order_id, crop_id, quantity, unit_price, crop_name)
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                order_id,
                item.crop_id,
                item.quantity,
                item.unit_price,
                item.crop_name
            )
        )
    
    conn.commit()
    
    # Return the created order with its ID
    created_order = {**order.dict(), "id": order_id}
    
    # Optional: Clear the cart after creating an order
    cart_id = order.items[0].cart_id if order.items else None
    if cart_id:
        cursor.execute("DELETE FROM cart_items WHERE cart_id = ?", (cart_id,))
        conn.commit()
    
    conn.close()
    
    return created_order

@router.get("/orders/{order_id}", response_model=dict)
async def get_order(order_id: int):
    """Get a specific order with its items"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    # Get order details
    cursor.execute("SELECT * FROM orders WHERE id = ?", (order_id,))
    order = cursor.fetchone()
    
    if order is None:
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found"
        )
    
    # Get order items
    cursor.execute("SELECT * FROM order_items WHERE order_id = ?", (order_id,))
    items = cursor.fetchall()
    
    conn.close()
    
    return {
        **dict(order),
        "items": [dict(item) for item in items]
    }

@router.get("/dashboard/stats")
async def get_dashboard_stats():
    """Get statistics for the consumer dashboard"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Get total number of orders
    cursor.execute("SELECT COUNT(*) FROM orders")
    total_orders = cursor.fetchone()[0]
    
    # Get total spending
    cursor.execute("SELECT SUM(total_amount) FROM orders")
    total_spending = cursor.fetchone()[0] or 0
    
    # Get orders by status
    cursor.execute("SELECT status, COUNT(*) as count FROM orders GROUP BY status")
    orders_by_status = [{"status": row[0], "count": row[1]} for row in cursor.fetchall()]
    
    # Get marketplace product count
    farmer_db_path = Path(__file__).parent.parent / "farmer" / "data" / "farmer.db"
    
    total_products = 0
    if os.path.exists(farmer_db_path):
        farmer_conn = sqlite3.connect(farmer_db_path)
        farmer_cursor = farmer_conn.cursor()
        
        farmer_cursor.execute("SELECT COUNT(*) FROM crops WHERE available = 1")
        total_products = farmer_cursor.fetchone()[0]
        
        farmer_conn.close()
    
    conn.close()
    
    return {
        "total_orders": total_orders,
        "total_spending": total_spending,
        "orders_by_status": orders_by_status,
        "total_products": total_products
    } 