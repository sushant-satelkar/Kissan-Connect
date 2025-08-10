/**
 * Service to interact with the authentication API
 */

const API_BASE_URL = 'http://localhost:8000/auth';

/**
 * Register a new user
 * @param {Object} userData - User registration data (username, password, role, etc.)
 * @returns {Promise<Object>} - Registration response with token
 */
export const registerUser = async (userData) => {
  try {
    console.log('Registering user with data:', JSON.stringify(userData));
    
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Raw error response:', errorText);
      
      let errorDetail = 'Registration failed';
      
      try {
        // Try to parse as JSON
        const errorData = JSON.parse(errorText);
        console.log('Parsed error data:', errorData);
        
        // Handle array response (validation errors)
        if (Array.isArray(errorData)) {
          if (errorData.length > 0) {
            if (typeof errorData[0] === 'object') {
              // If it's an object inside the array, stringify it
              errorDetail = JSON.stringify(errorData[0]);
            } else {
              errorDetail = String(errorData[0]);
            }
          }
        } else if (typeof errorData === 'object') {
          // Handle object response
          if (errorData.detail) {
            errorDetail = errorData.detail;
          } else {
            // Just stringify the whole object if no detail field
            errorDetail = JSON.stringify(errorData);
          }
        } else {
          errorDetail = String(errorData);
        }
      } catch (e) {
        // If not JSON, use text directly
        errorDetail = errorText || `Registration failed with status ${response.status}`;
      }
      
      console.error('Registration error response (formatted):', errorDetail);
      throw new Error(errorDetail);
    }

    const data = await response.json();
    console.log('Registration successful:', data);
    return data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

/**
 * Login a user
 * @param {Object} credentials - Login credentials (username, password, role)
 * @returns {Promise<Object>} - Login response with token
 */
export const loginUser = async (credentials) => {
  try {
    console.log('Logging in user with credentials:', JSON.stringify({
      ...credentials,
      password: '***HIDDEN***' // Don't log the actual password
    }));
    
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Raw login error response:', errorText);
      
      let errorDetail = 'Login failed';
      
      try {
        // Try to parse as JSON
        const errorData = JSON.parse(errorText);
        console.log('Parsed login error data:', errorData);
        
        // Handle array response (validation errors)
        if (Array.isArray(errorData)) {
          if (errorData.length > 0) {
            if (typeof errorData[0] === 'object') {
              // If it's an object inside the array, stringify it
              errorDetail = JSON.stringify(errorData[0]);
            } else {
              errorDetail = String(errorData[0]);
            }
          }
        } else if (typeof errorData === 'object') {
          // Handle object response
          if (errorData.detail) {
            errorDetail = errorData.detail;
          } else {
            // Just stringify the whole object if no detail field
            errorDetail = JSON.stringify(errorData);
          }
        } else {
          errorDetail = String(errorData);
        }
      } catch (e) {
        // If not JSON, use text directly
        errorDetail = errorText || `Login failed with status ${response.status}`;
      }
      
      console.error('Login error response (formatted):', errorDetail);
      throw new Error(errorDetail);
    }

    const data = await response.json();
    console.log('Login successful:', data);
    return data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

/**
 * Verify user token (can be used to check if token is still valid)
 * @returns {Promise<Object>} - Verification response
 */
export const verifyToken = async () => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`${API_BASE_URL}/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Token verification failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error verifying token:', error);
    throw error;
  }
}; 