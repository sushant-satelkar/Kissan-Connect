/**
 * Authentication service for managing user authentication state
 * Handles login, registration, logout, and checking authentication status
 */

// Store auth tokens in localStorage
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_info';

// Custom event for auth state changes
const AUTH_CHANGE_EVENT = 'auth-state-changed';

// Dispatch auth change event
const dispatchAuthEvent = () => {
  // Create and dispatch a custom event that components can listen for
  const event = new Event(AUTH_CHANGE_EVENT);
  window.dispatchEvent(event);
};

// Login user and store token and user data
export const loginUser = (userData, token) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(userData));
  dispatchAuthEvent();
  return true;
};

// Register user (typically would call API, then login)
export const registerUser = async (userData) => {
  // In a real app, you would call your API here
  // For now, we'll simulate a successful registration
  dispatchAuthEvent();
  return { success: true, user: userData };
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  return !!token; // Convert to boolean
};

// Get current user data
export const getCurrentUser = () => {
  try {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

// Check if user has specific role
export const hasRole = (role) => {
  const user = getCurrentUser();
  return user && user.role === role;
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  dispatchAuthEvent();
  return true;
};

// Get auth token for API requests
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Export the event name for components to listen to
export const AUTH_EVENT = AUTH_CHANGE_EVENT;

export default {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  isAuthenticated,
  hasRole,
  getToken,
}; 