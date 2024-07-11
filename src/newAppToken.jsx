import React from 'react';
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";

// Array of public routes that don't require authentication
const publicRoutes = [
  '/auth/sign-in',
  '/auth/sign-up',
  '/auth/forgot-password',
  // Add any other public routes here
];

// New component for protected routes
const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  const hasToken = () => {
    // Check for token in localStorage
    const token = localStorage.getItem('token');
    if (token) return true;

    // Check for token in cookies
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'token' && value) return true;
    }

    return false;
  };

  // Check if the current path is in the publicRoutes array
  if (publicRoutes.includes(location.pathname)) {
    return children;
  }

  if (!hasToken()) {
    // Redirect to authentication page if no token found
    return <Navigate to="/auth/sign-in" replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/dashboard/*" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
    </Routes>
  );
}

export default App;