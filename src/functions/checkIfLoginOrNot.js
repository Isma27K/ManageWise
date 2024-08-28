import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from './auth'; 

import LoadingComponent from '../components/loading/loading.compoment';

const CheckLogin = ({ element: Element, redirectTo, ...rest }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Simulate a delay to wait for localStorage to be read
    const timer = setTimeout(() => {
      setIsLoggedIn(isAuthenticated());
      setIsChecking(false);
    }, 2500); // 2.500 seconds delay

    // Clear timeout on component unmount
    return () => clearTimeout(timer);
  }, []);

  if (isChecking) {
    return <LoadingComponent />; // Optional: Display a loading indicator
  }

  // If authenticated and trying to access login/register page, redirect
  if (isLoggedIn && redirectTo) {
    return <Navigate to={redirectTo} />;
  }

  // Otherwise, render the provided element
  return <Element {...rest} />;
};

export default CheckLogin;
