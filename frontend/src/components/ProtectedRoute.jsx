import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token } = useAuth();

  // 1. If not authenticated at all, redirect to the login gateway
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // 2. If access rules are defined and user role doesn't match, send back to home fallback entry
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  // 3. Render authenticated layout node cleanly
  return children;
};

export default ProtectedRoute;