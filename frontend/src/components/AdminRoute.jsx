import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  // 1. Check if user exists
  // 2. Check if user role is 'admin'
  if (!user || user.role !== 'admin') {
    // If not allowed, kick them to Home Page
    return <Navigate to="/" replace />;
  }

  // If allowed, show the protected page
  return children;
};

export default AdminRoute;