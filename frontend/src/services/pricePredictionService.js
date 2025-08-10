/**
 * Service to interact with the price prediction API
 */

const API_BASE_URL = 'http://localhost:8000/price-prediction';

/**
 * Predicts the crop price based on the provided data
 * @param {Object} cropData - The crop data for prediction
 * @returns {Promise<Object>} - The prediction response
 */
export const predictCropPrice = async (cropData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cropData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to predict price');
    }

    return await response.json();
  } catch (error) {
    console.error('Error predicting crop price:', error);
    throw error;
  }
};

/**
 * Checks if the price prediction API is available
 * @returns {Promise<boolean>} - Whether the API is available
 */
export const checkPricePredictionApiHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    return data.status === 'healthy' && data.model_loaded === true;
  } catch (error) {
    console.error('Error checking API health:', error);
    return false;
  }
};

export default {
  predictCropPrice,
  checkPricePredictionApiHealth,
}; 