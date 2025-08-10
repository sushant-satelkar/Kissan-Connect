import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import sys

# Add the backend directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import API routers from different modules
from price_prediction.api.prediction_api import app as price_prediction_app
from auth.auth_api import router as auth_router

# Import the new dashboard routers
try:
    from farmer.dashboard_api import router as farmer_router
    farmer_module_available = True
except ImportError:
    farmer_module_available = False

try:
    from consumer.dashboard_api import router as consumer_router
    consumer_module_available = True
except ImportError:
    consumer_module_available = False

# Create the main FastAPI application
app = FastAPI(
    title="KisaanConnect API",
    description="Backend API for KisaanConnect - A Farmer to Consumer Marketplace",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development, in production specify actual domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the auth router
app.include_router(auth_router, prefix="/auth", tags=["authentication"])

# Mount the price prediction API
app.mount("/price-prediction", price_prediction_app)

# Include the new dashboard routers if available
if farmer_module_available:
    app.include_router(farmer_router, prefix="/farmer", tags=["farmer"])

if consumer_module_available:
    app.include_router(consumer_router, prefix="/consumer", tags=["consumer"])

# Root endpoint
@app.get("/")
async def root():
    services = [
        {
            "name": "Authentication",
            "endpoint": "/auth",
            "description": "User authentication and registration"
        },
        {
            "name": "Price Prediction",
            "endpoint": "/price-prediction",
            "description": "ML-based crop price prediction"
        }
    ]
    
    if farmer_module_available:
        services.append({
            "name": "Farmer Dashboard",
            "endpoint": "/farmer",
            "description": "Farmer crop management and dashboard"
        })
    
    if consumer_module_available:
        services.append({
            "name": "Consumer Dashboard",
            "endpoint": "/consumer",
            "description": "Consumer marketplace and orders"
        })
    
    return {
        "message": "Welcome to KisaanConnect API",
        "services": services
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    # Setup database
    from auth.db_setup import create_tables, add_test_users
    create_tables()
    add_test_users()
    
    # Start server
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)