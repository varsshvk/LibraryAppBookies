// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("jwt");

  if (!token) {
    // not logged in
    return <Navigate to="/" />;
  }

  try {
    const decoded = jwtDecode(token);
    const roles = decoded.roles || [];

    // check if user has required role
    const isAuthorized = roles.some((role) => allowedRoles.includes(role));

    if (!isAuthorized) {
      // redirect to respective dashboard if unauthorized
      if (roles.includes("ROLE_ADMIN")) {
        return <Navigate to="/admindashboard" />;
      } else if (roles.includes("ROLE_USER")) {
        return <Navigate to="/userdashboard" />;
      } else {
        return <Navigate to="/" />;
      }
    }

    // allowed → show the page
    return children;
  } catch (err) {
    // invalid or expired token
    localStorage.removeItem("jwt");
    return <Navigate to="/" />;
  }
};

export default ProtectedRoute;
