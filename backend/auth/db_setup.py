import sqlite3
import os
import hashlib
from pathlib import Path

# Database path
DB_DIR = Path(__file__).parent / "data"
DB_PATH = DB_DIR / "users.db"

def hash_password(password):
    """Simple password hashing using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

def create_tables():
    """Create the users table if it doesn't exist"""
    # Make sure the data directory exists
    DB_DIR.mkdir(exist_ok=True)
    
    # Connect to SQLite database
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Create users table with simpler structure
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL,
        name TEXT,
        email TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    # Commit changes and close connection
    conn.commit()
    conn.close()
    
    print(f"Database setup completed at {DB_PATH}")

def add_test_users():
    """Add test users to the database"""
    # Connect to SQLite database
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Check if test users already exist
    cursor.execute("SELECT COUNT(*) FROM users WHERE username IN ('farmer1', 'consumer1')")
    count = cursor.fetchone()[0]
    
    if count == 0:
        # Add a test farmer
        password_hash = hash_password("password123")
        cursor.execute(
            "INSERT INTO users (username, password_hash, role, name, email) VALUES (?, ?, ?, ?, ?)",
            ("farmer1", password_hash, "farmer", "John Farmer", "farmer1@example.com")
        )
        
        # Add a test consumer
        password_hash = hash_password("password123")
        cursor.execute(
            "INSERT INTO users (username, password_hash, role, name, email) VALUES (?, ?, ?, ?, ?)",
            ("consumer1", password_hash, "consumer", "Mary Consumer", "consumer1@example.com")
        )
        
        # Commit changes
        conn.commit()
        print("Added test users: farmer1 and consumer1 (password: password123)")
    else:
        print("Test users already exist")
    
    # Close connection
    conn.close()

if __name__ == "__main__":
    create_tables()
    add_test_users() 