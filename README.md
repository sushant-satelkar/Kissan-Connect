# KisaanConnect - Farmer-to-Consumer Marketplace

A web platform that connects farmers directly to consumers, eliminating intermediaries. The platform includes a feature to predict crop prices based on historical data, weather conditions, and market trends to help farmers make informed selling decisions.

## Tech Stack

- **Frontend**: React.js with Bootstrap & CSS
- **Backend**: FastAPI (Python)
- **Database**: SQLite
- **ML Model**: Scikit-learn (for price prediction)
- **Chatbot**: Gemini API

## Features

1. **E-commerce Interface** - Farmers can list produce, and consumers can browse and buy directly
2. **ML-Based Price Prediction** - Predict crop prices based on data trends
3. **Multi-language Support** - Google Translate integration for accessibility
4. **Chatbot** - Assistance in pricing and best selling times

## Project Structure

```
HackHive/frontend/         # React.js frontend application
backend/                   # FastAPI backend application
  ├── price_prediction/    # Price prediction service
  │   ├── api/            # API endpoints
  │   ├── data/           # Data files
  │   └── models/         # ML models
  ├── main.py             # Main FastAPI application
  └── requirements.txt    # Python dependencies
```

## Setup and Installation

### Backend Setup

1. Navigate to the backend directory
   ```
   cd backend
   ```

2. Run the setup batch file (Windows)
   ```
   run_app.bat
   ```

   Or manually:
   ```
   pip install -r requirements.txt
   python train_price_model.py
   python main.py
   ```

3. The FastAPI server will start at http://localhost:8000
   - API docs: http://localhost:8000/docs

### Frontend Setup

1. Navigate to the frontend directory
   ```
   cd HackHive/frontend
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm start
   ```

4. The React app will open at http://localhost:3000

## Features Overview

### 1. Farmer Dashboard
- Add and manage crop listings
- Price prediction tool
- Order management

### 2. Consumer Dashboard
- Browse available products
- Shopping cart functionality
- Order tracking

### 3. Multi-language Support
- Integrated Google Translate for multiple languages
- Focused on Indian languages for better accessibility

### 4. Price Prediction
- ML-based crop price prediction
- Factors in crop type, quantity, season, weather, and market trends
- Provides price range with confidence level "# farmer-consumer" 
