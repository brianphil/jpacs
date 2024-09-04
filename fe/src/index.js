import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Render the application
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
