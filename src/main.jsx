import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@material-tailwind/react";
import { MaterialTailwindControllerProvider } from "@/context";
import "../public/css/tailwind.css";

(function() {
  const publicRoutes = [
    '/auth/sign-in',
    '/auth/sign-up',
   // '/dashboard/crypto',
    '/auth/forgot-password',
  ];
  const token = localStorage.getItem('token') || getCookie('token');
    const currentPath = window.location.pathname;
  const isPublicRoute = publicRoutes.some(route => currentPath.startsWith(route));
  if (!token && !isPublicRoute) {
     window.location.href = '/auth/sign-in';
  }
   function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
})();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <MaterialTailwindControllerProvider>
          <App />
        </MaterialTailwindControllerProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);