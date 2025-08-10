import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated, hasRole } from '../../services/authService';

/**
 * Protected Route component that checks if user is authenticated and has the required role
 * @param {Object} props - Component props
 * @param {string} props.requiredRole - The role required to access this route (farmer or consumer)
 * @returns {JSX.Element} - The protected route component
 */
const ProtectedRoute = ({ requiredRole }) => {
  const isAuth = isAuthenticated();
  const userHasRole = hasRole(requiredRole);
  
  // Check if user is authenticated and has the required role
  if (!isAuth) {
    // Not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }
  
  if (!userHasRole) {
    // Wrong role, redirect to appropriate dashboard or unauthorized page
    if (hasRole('farmer')) {
      return <Navigate to="/farmer" replace />;
    } else if (hasRole('consumer')) {
      return <Navigate to="/consumer" replace />;
    } else {
      return <Navigate to="/unauthorized" replace />;
    }
  }
  
  // User is authenticated and has the correct role, render the child route
  return <Outlet />;
};

export default ProtectedRoute; 