import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredAuth, redirectTo = '/login' }) => {

  const isAuthenticated = localStorage.getItem('jwtToken') !== null;
  const hasAuthLink = localStorage.getItem('authLink') !== null;

  if (requiredAuth === 'jwt' && !isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (requiredAuth === 'authLink' && !hasAuthLink) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute;