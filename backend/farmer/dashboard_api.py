from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import List, Optional
import sqlite3
import os
from pathlib import Path

# Setup router
router = APIRouter()

# Define path for farmer database
DB_DIR = Path(__file__).parent / "data"
DB_PATH = DB_DIR / "farmer.db"

# Make sure the directory exists
os.makedirs(DB_DIR, exist_ok=True)

# Define models
class CropListing(BaseModel):
    id: Optional[int] = None
    name: str
    quantity: float
    unit: str
    price_per_unit: float
    description: Optional[str] = None
    location: Optional[str] = None
    available: bool = True
    farmer_id: Optional[int] = None

def setup_db():
    """Set up the farmer database"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Create crops table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS crops (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        quantity REAL NOT NULL,
        unit TEXT NOT NULL,
        price_per_unit REAL NOT NULL,
        description TEXT,
        location TEXT,
        available INTEGER DEFAULT 1,
        farmer_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    # Add some sample crops if none exist
    cursor.execute("SELECT COUNT(*) FROM crops")
    count = cursor.fetchone()[0]
    
    if count == 0:
        sample_crops = [
            ("Rice", 100, "kg", 45.0, "High quality Basmati rice", "Punjab", 1, 1),
            ("Wheat", 200, "kg", 30.0, "Organic wheat", "Haryana", 1, 1),
            ("Tomatoes", 50, "kg", 25.0, "Fresh red tomatoes", "Maharashtra", 1, 1),
            ("Potatoes", 150, "kg", 20.0, "High quality potatoes", "Uttar Pradesh", 1, 1),
            ("Onions", 75, "kg", 35.0, "Fresh red onions", "Maharashtra", 1, 1)
        ]
        
        cursor.executemany(
            "INSERT INTO crops (name, quantity, unit, price_per_unit, description, location, available, farmer_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            sample_crops
        )
        
        conn.commit()
        print("Added sample crop listings")
    
    conn.close()

# Set up the database on module import
setup_db()

@router.get("/", response_model=List[CropListing])
async def get_all_crops():
    """Get all crop listings"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM crops ORDER BY created_at DESC")
    rows = cursor.fetchall()
    
    conn.close()
    
    return [dict(row) for row in rows]

@router.get("/{crop_id}", response_model=CropListing)
async def get_crop(crop_id: int):
    """Get a specific crop listing"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM crops WHERE id = ?", (crop_id,))
    row = cursor.fetchone()
    
    conn.close()
    
    if row is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Crop not found"
        )
    
    return dict(row)

@router.post("/", response_model=CropListing)
async def create_crop(crop: CropListing):
    """Create a new crop listing"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # For demo purposes, we'll use farmer_id 1 if none provided
    farmer_id = crop.farmer_id or 1
    
    cursor.execute(
        """
        INSERT INTO crops (name, quantity, unit, price_per_unit, description, location, available, farmer_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            crop.name,
            crop.quantity,
            crop.unit,
            crop.price_per_unit,
            crop.description,
            crop.location,
            1 if crop.available else 0,
            farmer_id
        )
    )
    
    crop_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    # Return the created crop with its ID
    return {**crop.dict(), "id": crop_id}

@router.put("/{crop_id}", response_model=CropListing)
async def update_crop(crop_id: int, crop: CropListing):
    """Update a crop listing"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Check if crop exists
    cursor.execute("SELECT id FROM crops WHERE id = ?", (crop_id,))
    if cursor.fetchone() is None:
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Crop not found"
        )
    
    # Update the crop
    cursor.execute(
        """
        UPDATE crops
        SET name = ?, quantity = ?, unit = ?, price_per_unit = ?, 
            description = ?, location = ?, available = ?
        WHERE id = ?
        """,
        (
            crop.name,
            crop.quantity,
            crop.unit,
            crop.price_per_unit,
            crop.description,
            crop.location,
            1 if crop.available else 0,
            crop_id
        )
    )
    
    conn.commit()
    
    # Get the updated crop
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM crops WHERE id = ?", (crop_id,))
    updated_crop = dict(cursor.fetchone())
    
    conn.close()
    
    return updated_crop

@router.delete("/{crop_id}")
async def delete_crop(crop_id: int):
    """Delete a crop listing"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Check if crop exists
    cursor.execute("SELECT id FROM crops WHERE id = ?", (crop_id,))
    if cursor.fetchone() is None:
        conn.close()
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Crop not found"
        )
    
    # Delete the crop
    cursor.execute("DELETE FROM crops WHERE id = ?", (crop_id,))
    conn.commit()
    conn.close()
    
    return {"message": "Crop deleted successfully"}

@router.get("/dashboard/stats")
async def get_dashboard_stats():
    """Get statistics for the farmer dashboard"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Get total number of crops
    cursor.execute("SELECT COUNT(*) FROM crops")
    total_crops = cursor.fetchone()[0]
    
    # Get total quantity of all crops
    cursor.execute("SELECT SUM(quantity) FROM crops")
    total_quantity = cursor.fetchone()[0] or 0
    
    # Get total value of all crops
    cursor.execute("SELECT SUM(quantity * price_per_unit) FROM crops")
    total_value = cursor.fetchone()[0] or 0
    
    # Get crops grouped by type with count
    cursor.execute("SELECT name, COUNT(*) as count FROM crops GROUP BY name ORDER BY count DESC")
    crops_by_type = [{"name": row[0], "count": row[1]} for row in cursor.fetchall()]
    
    conn.close()
    
    return {
        "total_crops": total_crops,
        "total_quantity": total_quantity,
        "total_value": total_value,
        "crops_by_type": crops_by_type
    } 