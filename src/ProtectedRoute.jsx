import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from "react-router-dom";

const publicRoutes = [
  '/auth/sign-in',
  '/auth/sign-up',
  '/auth/forgot-password',
  // Add any other public routes here
];

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
        console.log("start check");
      // Check for token in localStorage
      const token = localStorage.getItem('token');
      if (token) {
        console.log("coock :))))) ffind");
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

      // Check for token in cookies
      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'token' && value) {
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }
      }
      console.log(":(((( coock not ffind");
      setIsAuthenticated(false);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; 
  }

  // Check if the current path is in the publicRoutes array
  if (publicRoutes.includes(location.pathname)) {
    return children;
  }

  if (!isAuthenticated) {
    console.log("No token found, redirecting to sign-in page");
    return <Navigate to="/auth/sign-in" replace />;
  }

  return children;
};

export default ProtectedRoute;