import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../services/authService';
import * as authApi from '../../services/api/authApi';
import '../../styles/auth/Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleRoleSelect = (role) => {
    setFormData(prevState => ({
      ...prevState,
      role
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Basic validation
    if (!formData.username || !formData.password || !formData.role) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    try {
      // Call the API for login
      const response = await authApi.loginUser(formData);
      
      // Store auth data in localStorage via authService
      loginUser({
        username: formData.username,
        role: formData.role,
        id: response.id || 1
      }, response.access_token || response.token);
      
      console.log("Login successful, navigating to dashboard...");
      
      // Redirect based on role
      if (formData.role === 'farmer') {
        navigate('/farmer', { replace: true });
      } else if (formData.role === 'consumer') {
        navigate('/consumer', { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
      
      // Ensure we never show [object Object]
      let errorMessage;
      
      if (typeof err === 'string') {
        errorMessage = err;
      } else if (err instanceof Error) {
        const errorMsg = err.message;
        // Check if the error message starts with { or [ indicating JSON
        if (errorMsg.startsWith('{') || errorMsg.startsWith('[')) {
          try {
            // Try to extract a readable message from the JSON
            const jsonError = JSON.parse(errorMsg);
            if (jsonError.msg) {
              errorMessage = jsonError.msg;
            } else if (jsonError.loc && jsonError.type) {
              // This is likely a validation error
              errorMessage = `${jsonError.type} error for ${jsonError.loc.join('.')}`;
            } else {
              // Fallback to a generic message
              errorMessage = 'Validation error occurred';
            }
          } catch (e) {
            // If we can't parse the JSON, use the message directly
            errorMessage = errorMsg;
          }
        } else {
          errorMessage = errorMsg || 'Unknown error occurred';
        }
      } else if (err && typeof err === 'object') {
        errorMessage = 'Invalid username, password, or role';
      } else {
        errorMessage = 'Login failed. Please try again.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login to KisaanConnect</h2>
        
        {error && <div className="auth-error">{error}</div>}
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
              <button 
                type="button" 
                className="password-toggle-btn"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          
          <div className="form-group">
            <label>Select your role</label>
            <div className="role-selector">
              <button
                type="button"
                className={`role-buttons ${formData.role === 'farmer' ? 'active' : ''}`}
                onClick={() => handleRoleSelect('farmer')}
              >
                Farmer
              </button>
              <button
                type="button"
                className={`role-buttons ${formData.role === 'consumer' ? 'active' : ''}`}
                onClick={() => handleRoleSelect('consumer')}
              >
                Consumer
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="auth-button" 
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="auth-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login; 