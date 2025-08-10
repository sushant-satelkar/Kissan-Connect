import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/App.css';

// Components
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import FarmerDashboard from './components/farmer/FarmerDashboard';
import ConsumerDashboard from './components/consumer/ConsumerDashboard';
import NgoDashboard from './components/ngo/NgoDashboard';
import Chatbot from './components/Chatbot';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Adopt Farm Components
import AdoptFarm from './components/AdoptFarm';
import FarmerDetail from './components/FarmerDetail';

// Auth Service
import { isAuthenticated, hasRole } from './services/authService';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/ngo" element={<NgoDashboard />} />
          
          {/* Farmer and Consumer Dashboards (publicly accessible) */}
          <Route path="/farmer" element={<FarmerDashboard />} />
          <Route path="/consumer" element={<ConsumerDashboard />} />
          
          {/* Adopt a Farm Routes */}
          <Route path="/adopt-farm" element={<AdoptFarm />} />
          <Route path="/adopt-farm/:id" element={<FarmerDetail />} />
          
          {/* Redirect to home if no route matches */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Chatbot />
      </div>
    </Router>
  );
}

export default App; 