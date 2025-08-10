#!/usr/bin/env python
"""
Script to train the crop price prediction model.
Run this script to train and save the model before starting the API.
"""

import os
import sys

# Add the current directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import the training function
from price_prediction.models.train_model import train_model

if __name__ == "__main__":
    print("Training crop price prediction model...")
    model, mae = train_model()
    print(f"Model training completed with MAE: {mae:.2f}")
    print("You can now start the API with: python main.py") 