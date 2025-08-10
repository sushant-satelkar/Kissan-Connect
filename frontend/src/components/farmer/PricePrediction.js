import React, { useState, useEffect } from 'react';
import '../../styles/farmer/PricePrediction.css';
import { predictCropPrice, checkPricePredictionApiHealth } from '../../services/pricePredictionService';

const PricePrediction = () => {
  const [formData, setFormData] = useState({
    crop_name: '',
    category: 'Vegetables',
    center_state: '',
    quantity: ''
  });
  
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiAvailable, setApiAvailable] = useState(true);
  
  // List of crop categories
  const categoryOptions = [
    'Vegetables',
    'Fruits'
  ];

  // List of fruits for the dropdown
  const fruitOptions = [
    'Select a crop',
    'ACID LIME',
    'AONLA',
    'APPLE',
    'APPLE (ANTI BIRD/ANTI HAIL NET)',
    'Apple Ber',
    'BANANA',
    'BER',
    'CIRTUS',
    'GRAPES',
    'GUAVA',
    'LITCHI',
    'MANGO',
    'Mulberry',
    'PAPAYA',
    'Phalsa',
    'PINEAPPLE',
    'POMEGRANATE',
    'SAPOTA'
  ];

  // List of vegetables for the dropdown
  const vegetableOptions = [
    'Select a crop',
    'BITTER GOURD',
    'BRINJAL',
    'CABBAGE',
    'CAULIFLOWER',
    'GARLIC',
    'GINGER',
    'GREEN CHILLY',
    'OKRA',
    'ONION',
    'PEAS',
    'POTATO',
    'TOMATO'
  ];

  // Get crop options based on selected category
  const getCropOptions = () => {
    if (formData.category === 'Fruits') {
      return fruitOptions;
    } else {
      return vegetableOptions;
    }
  };

  const centerStateOptions = [
    'Select a location',
    'AHMEDABAD',
    'AMRITSAR',
    'BANGALURU',
    'BARAUT',
    'BHOPAL',
    'BHUBANESHWAR',
    'CHANDIGARH',
    'CHENNAI',
    'DEHRADUN',
    'DELHI',
    'GANGTOK',
    'GUWAHATI',
    'HYDERABAD',
    'JAIPUR',
    'JAMMU',
    'KOLKATA',
    'LASALGAON',
    'LUCKNOW',
    'MUMBAI',
    'NAGPUR',
    'NASHIK',
    'PATNA',
    'PIMPALGAON',
    'PUNE',
    'RAIPUR',
    'RANCHI',
    'SHIMLA',
    'SRINAGAR',
    'TRIVANDRUM',
    'VARANASI',
    'VIJAYAWADA'
  ];
  
  // Check if the API is available
  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const isHealthy = await checkPricePredictionApiHealth();
        setApiAvailable(isHealthy);
      } catch (error) {
        console.error('API health check failed:', error);
        setApiAvailable(false);
      }
    };
    
    checkApiHealth();
  }, []);

  // Reset crop name when category changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      crop_name: 'Select a crop'
    }));
  }, [formData.category]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.crop_name === 'Select a crop' || !formData.quantity || formData.center_state === 'Select a location') {
      alert('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    
    // Create payload for API
    const payload = {
      crop_name: formData.crop_name,
      category: formData.category,
      center_state: formData.center_state,
      quantity: parseFloat(formData.quantity)
    };
    
    try {
      if (apiAvailable) {
        // Use real API prediction
        const result = await predictCropPrice(payload);
        setPrediction({
          min: result.min_price,
          max: result.max_price,
          median: result.median_price || Math.round((result.min_price + result.max_price) / 2), // Use median if available
          factors: result.factors
        });
      } else {
        // Use fallback prediction (mocked)
        fallbackPrediction();
      }
    } catch (error) {
      console.error('Prediction failed:', error);
      fallbackPrediction();
    } finally {
      setLoading(false);
    }
  };
  
  // Fallback prediction method when API is unavailable
  const fallbackPrediction = () => {
    // Base price ranges based on the CSV data
    const priceRanges = {
      // Vegetables
      'BITTER GOURD': { min: 1500, max: 5000, median: 3000 },
      'BRINJAL': { min: 1200, max: 3500, median: 2200 },
      'CABBAGE': { min: 800, max: 2500, median: 1600 },
      'CAULIFLOWER': { min: 1500, max: 4000, median: 2600 },
      'GARLIC': { min: 2000, max: 8000, median: 4800 },
      'GINGER': { min: 3000, max: 10000, median: 6200 },
      'GREEN CHILLY': { min: 2000, max: 7000, median: 4200 },
      'OKRA': { min: 1500, max: 4500, median: 2900 },
      'ONION': { min: 1000, max: 4000, median: 2300 },
      'PEAS': { min: 2000, max: 5000, median: 3200 },
      'POTATO': { min: 800, max: 2500, median: 1600 },
      'TOMATO': { min: 1000, max: 4000, median: 2300 },
      
      // Fruits
      'ACID LIME': { min: 1800, max: 5500, median: 3300 },
      'AONLA': { min: 2000, max: 6000, median: 3900 },
      'APPLE': { min: 3000, max: 9000, median: 5600 },
      'APPLE (ANTI BIRD/ANTI HAIL NET)': { min: 3500, max: 10000, median: 6200 },
      'Apple Ber': { min: 2500, max: 7000, median: 4100 },
      'BANANA': { min: 1000, max: 3000, median: 1800 },
      'BER': { min: 1200, max: 3500, median: 2300 },
      'CIRTUS': { min: 2000, max: 6000, median: 3600 },
      'GRAPES': { min: 2500, max: 8000, median: 4600 },
      'GUAVA': { min: 1800, max: 5000, median: 3300 },
      'LITCHI': { min: 3000, max: 8000, median: 5100 },
      'MANGO': { min: 2000, max: 10000, median: 5100 },
      'Mulberry': { min: 1500, max: 4000, median: 2600 },
      'PAPAYA': { min: 1000, max: 3000, median: 1800 },
      'Phalsa': { min: 2000, max: 5000, median: 3100 },
      'PINEAPPLE': { min: 1500, max: 5000, median: 2900 },
      'POMEGRANATE': { min: 3000, max: 9000, median: 5600 },
      'SAPOTA': { min: 1800, max: 5000, median: 3300 }
    };
    
    // Get price range for selected crop, or use default
    const priceRange = priceRanges[formData.crop_name] || { min: 1000, max: 5000, median: 2600 };
    
    // Calculate price based on quantity
    const quantityMultiplier = formData.quantity > 100 ? 0.9 : 1.0; // Bulk discount
    
    // Calculate predicted prices
    const quantity = parseFloat(formData.quantity);
    
    setPrediction({
      min: Math.round(priceRange.min * quantityMultiplier),
      max: Math.round(priceRange.max * quantityMultiplier),
      median: Math.round(priceRange.median * quantityMultiplier),
      suggestedPrice: Math.round(priceRange.median * quantityMultiplier),
      factors: {
        crop_name: formData.crop_name,
        category: formData.category,
        center_state: formData.center_state,
        quantity: quantity
      }
    });
  };
  
  return (
    <div className="price-prediction">
      <h2>Crop Price Prediction Tool</h2>
      
      <div className="prediction-container">
        <div className="prediction-form-container">
          <form onSubmit={handleSubmit} className="prediction-form">
            <div className="form-group">
              <label htmlFor="category">Crop Category*</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {categoryOptions.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="crop_name">Crop Name*</label>
              <select
                id="crop_name"
                name="crop_name"
                value={formData.crop_name}
                onChange={handleChange}
                required
              >
                {getCropOptions().map((crop, index) => (
                  <option key={index} value={crop}>{crop}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="center_state">Destination Market Location*</label>
              <select
                id="center_state"
                name="center_state"
                value={formData.center_state}
                onChange={handleChange}
                required
              >
                {centerStateOptions.map((location, index) => (
                  <option key={index} value={location}>{location}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="quantity">Quantity (kg)*</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Enter quantity"
                min="1"
                required
              />
            </div>
            
            <button type="submit" className="predict-button" disabled={loading}>
              {loading ? 'Predicting...' : 'Predict Price'}
            </button>
          </form>
        </div>
        
        <div className="prediction-result-container">
          {prediction ? (
            <div className="prediction-result">
              <h3>Predicted Price Range (per kg)</h3>
              <div className="price-range">
                <span className="min-price">₹{prediction.min}</span>
                <span className="median-price">₹{prediction.median}</span>
                <span className="max-price">₹{prediction.max}</span>
              </div>
              <div className="price-range-labels">
                <span>Min</span>
                <span>Median</span>
                <span>Max</span>
              </div>
              {prediction.suggestedPrice && (
                <div className="total-value">
                  <h4>Suggested Price</h4>
                  <p className="total-amount">₹{prediction.suggestedPrice}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="no-prediction">
              <p>Fill in the form and click "Predict Price" to get a price prediction for your crop.</p>
              <div className="prediction-tips">
                <h4>Tips for better predictions:</h4>
                <ul>
                  <li>Select the exact crop category and name</li>
                  <li>Choose the destination market location where you plan to sell</li>
                  <li>Enter the precise quantity you plan to sell</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PricePrediction; 