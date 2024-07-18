// App.js
import React ,{useEffect}from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from './AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
         <ProtectedRoute>   <Route path="/dashboard/*" element={
          
              <Dashboard />
          
          } />
          <Route path="/auth/*" element={<Auth />} />
          <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
        </ProtectedRoute>  </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;