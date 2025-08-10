import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../services/authService';
import * as authApi from '../../services/api/authApi';
import '../../styles/auth/Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    role: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
  
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Basic validation
    if (!formData.username || !formData.password || !formData.confirmPassword || !formData.role) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (!formData.username.match(/^[a-zA-Z0-9_]+$/)) {
      setError('Username must contain only letters, numbers, and underscores');
      setLoading(false);
      return;
    }

    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    try {
      // Prepare data for API
      const registerData = {
        username: formData.username,
        password: formData.password,
        role: formData.role
      };
      
      // Call the API for registration
      const registerResponse = await authApi.registerUser(registerData);
      
      if (registerResponse) {
        // After successful registration, login the user
        const loginResponse = await authApi.loginUser({
          username: formData.username,
          password: formData.password,
          role: formData.role
        });
        
        // Store auth data in localStorage via authService
        loginUser({
          username: formData.username,
          role: formData.role,
          id: loginResponse.id || registerResponse.id || 1
        }, loginResponse.access_token || loginResponse.token || registerResponse.token);
        
        console.log("Registration successful, navigating to dashboard...");
        
        // Redirect based on role
        if (formData.role === 'farmer') {
          navigate('/farmer', { replace: true });
        } else if (formData.role === 'consumer') {
          navigate('/consumer', { replace: true });
        }
      }
    } catch (err) {
      console.error('Registration error:', err);
      
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
        errorMessage = 'Username already exists or invalid input';
      } else {
        errorMessage = 'Registration failed. Please try again.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create KisaanConnect Account</h2>
        
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
              placeholder="Choose a username (letters, numbers, underscores)"
              required
            />
            <small className="form-text">Username must be at least 3 characters long and contain only letters, numbers, and underscores.</small>
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
                placeholder="Create a password (min. 8 characters)"
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
            <small className="form-text">Password must be at least 8 characters long.</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />
              <button 
                type="button" 
                className="password-toggle-btn"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          
          <div className="form-group">
            <label>I am a:</label>
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
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register; 