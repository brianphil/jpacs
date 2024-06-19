import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import routes from './routes'; // Import routes array
import 'bootstrap/dist/css/bootstrap.min.css';

const router = createBrowserRouter(routes);

const App = () => (
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);

export default App;
