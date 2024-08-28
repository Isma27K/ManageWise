import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from './auth'; // Importing the function from auth.js

const ProtectedRoute = ({ element, ...rest }) => {
  return isAuthenticated() ? element : <Navigate to="/" />;
};

export default ProtectedRoute;
