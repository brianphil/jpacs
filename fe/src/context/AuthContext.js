import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { config } from '../services/config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const configs = {
            headers: {
              Authorization: token,
            },
          };
          const { data } = await axios.get(`${config.BASE_URL}/api/auth/user`, configs);
          setUser(data);
        }
      } catch (error) {
        console.error("Authorization: ",error);
      }
    };

    fetchUser();
  }, []);

  const login = async (credentials) => {
    try {
      const { data } = await axios.post(`${config.BASE_URL}/api/auth/login`, credentials);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      return data
    } catch (error) {
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${config.BASE_URL}/api/auth/logout`);
      localStorage.removeItem('token');
      setUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
