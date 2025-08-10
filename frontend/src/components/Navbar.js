import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import logo from '../assets/images/logo.png';
import LanguageTranslator from './LanguageTranslator';
import { isAuthenticated, getCurrentUser, logoutUser, hasRole, AUTH_EVENT } from '../services/authService';

const Navbar = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Function to check and update auth state
  const checkAuth = () => {
    console.log("Checking auth state...");
    const auth = isAuthenticated();
    setAuthenticated(auth);
    if (auth) {
      setUser(getCurrentUser());
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    // Check authentication status on component mount
    checkAuth();
    
    // Listen for auth changes (both storage events and our custom event)
    window.addEventListener('storage', checkAuth);
    window.addEventListener(AUTH_EVENT, checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener(AUTH_EVENT, checkAuth);
    };
  }, []);

  const handleLogout = () => {
    logoutUser();
    // The checkAuth will be triggered by the custom event
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo-container">
          <Link to="/">
            <img src={logo} alt="KisaanConnect Logo" className="logo" />
            <h1 className="brand-name">KisaanConnect</h1>
          </Link>
        </div>
        
        <div className="nav-links">
          {/* Dashboard links visible to all users */}
          <Link to="/farmer" className="nav-link">
            Farmer Dashboard
          </Link>
          <Link to="/consumer" className="nav-link">
            Consumer Dashboard
          </Link>
          <Link to="/adopt-farm" className="nav-link adopt-farm-link">
            Adopt a Farm
          </Link>
          <Link to="/ngo" className="nav-link">
            NGO Support
          </Link>
        </div>
        
        <div className="auth-buttons-container">
          <div className="auth-buttons">
            <LanguageTranslator />
            
            {authenticated ? (
              <>
                <span className="welcome-text">Welcome, {user?.username}!</span>
                <button className="logout-button" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <button className="login-button">Log in</button>
                </Link>
                <Link to="/register">
                  <button className="signup-button">Sign up</button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 