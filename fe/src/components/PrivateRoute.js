import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ element }) => {
  const { user, loading } = useAuth();
  console.log("User: ", user)
  if (loading) {
    return <div>Loading...</div>;
  }
  return user ? element : <Navigate to="/login" />;
};

export default PrivateRoute;


