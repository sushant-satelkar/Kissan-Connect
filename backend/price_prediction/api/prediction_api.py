from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import pandas as pd
import joblib
import os
import sys
from typing import Optional, Dict, Any

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set paths
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
model_dir = os.path.join(parent_dir, 'models')

# Load model and feature columns
model_path = os.path.join(model_dir, 'crop_price_model.joblib')
feature_columns_path = os.path.join(model_dir, 'feature_columns.joblib')

# Initialize FastAPI app
app = FastAPI(
    title="Crop Price Prediction API",
    description="API for predicting crop prices using machine learning",
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

# Define the input model for prediction
class CropPriceInput(BaseModel):
    crop_name: str = Field(..., description="Name of the crop (e.g., Rice, Wheat, Potato)")
    quantity: float = Field(..., description="Quantity in kg", gt=0)
    season: str = Field(..., description="Growing season (e.g., Kharif, Rabi, Zaid)")
    region: str = Field(..., description="Region where crop is grown")
    rain_fall: Optional[float] = Field(None, description="Rainfall in mm")
    temperature: Optional[float] = Field(None, description="Temperature in Celsius")
    soil_quality: Optional[str] = Field(None, description="Soil quality (High, Medium, Low)")
    
    class Config:
        json_schema_extra = {
            "example": {
                "crop_name": "Rice",
                "quantity": 100,
                "season": "Kharif",
                "region": "Punjab",
                "rain_fall": 250.5,
                "temperature": 30.2,
                "soil_quality": "High"
            }
        }

# Define the response model
class PricePredictionResponse(BaseModel):
    predicted_price: float
    price_per_kg: float
    min_price: float
    max_price: float
    median_price: float
    confidence: str
    factors: Dict[str, Any]

# Handle startup events - load model when app starts
@app.on_event("startup")
async def startup_event():
    global model, feature_columns
    try:
        model = joblib.load(model_path)
        feature_columns = joblib.load(feature_columns_path)
        print("Model and feature columns loaded successfully")
    except Exception as e:
        print(f"Error loading model: {e}")
        model = None
        feature_columns = None

# Health check endpoint
@app.get("/health")
async def health_check():
    if model is not None:
        return {"status": "healthy", "model_loaded": True}
    return {"status": "unhealthy", "model_loaded": False}

# Prediction endpoint
@app.post("/predict", response_model=PricePredictionResponse)
async def predict_price(crop_input: CropPriceInput):
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        # Create a DataFrame with a single row for prediction
        input_data = pd.DataFrame({
            'crop_name': [crop_input.crop_name],
            'quantity': [crop_input.quantity],
            'season': [crop_input.season],
            'region': [crop_input.region],
            'rain_fall': [crop_input.rain_fall if crop_input.rain_fall is not None else 0],
            'temperature': [crop_input.temperature if crop_input.temperature is not None else 0],
            'soil_quality': [crop_input.soil_quality if crop_input.soil_quality is not None else 'Medium']
        })
        
        # Make prediction
        predicted_price = model.predict(input_data)[0]
        
        # Calculate price per kg
        price_per_kg = predicted_price / crop_input.quantity
        
        # Generate response with confidence interval (10% range)
        min_price = predicted_price * 0.9
        max_price = predicted_price * 1.1
        
        # Calculate median price (as an estimate based on min and max)
        median_price = (min_price + max_price) / 2
        
        # Determine confidence based on input completeness
        missing_values = sum(1 for value in [crop_input.rain_fall, crop_input.temperature, crop_input.soil_quality] if value is None)
        if missing_values == 0:
            confidence = "High"
        elif missing_values == 1:
            confidence = "Medium"
        else:
            confidence = "Low"
        
        # Return prediction results
        return PricePredictionResponse(
            predicted_price=round(predicted_price, 2),
            price_per_kg=round(price_per_kg, 2),
            min_price=round(min_price, 2),
            max_price=round(max_price, 2),
            median_price=round(median_price, 2),
            confidence=confidence,
            factors={
                "crop_type": crop_input.crop_name,
                "quantity": crop_input.quantity,
                "season": crop_input.season,
                "region": crop_input.region,
                "weather_conditions": {
                    "rain_fall": crop_input.rain_fall,
                    "temperature": crop_input.temperature
                },
                "soil_quality": crop_input.soil_quality
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

# Run with: uvicorn price_prediction.api.prediction_api:app --reload
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 