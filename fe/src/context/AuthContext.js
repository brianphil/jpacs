import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { config } from '../services/config';

// Create context
export const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Function to handle login
  const login = async (credentials) => {
    try {
      const response = await axios.post(`${config.BASE_URL}/api/auth/login`, credentials);
      setUser(response.data.user);
      localStorage.setItem('token', response.data.token); // Store token in localStorage
    } catch (error) {
      console.error('Login failed:', error);
      throw error; // Throw error for handling in components
    }
  };

  // Function to handle logout
  const logout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    setUser(null); // Clear user state
  };

  // Function to check if user is authenticated
  const isAuthenticated = () => {
    return !!user;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
