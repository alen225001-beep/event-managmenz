import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner text="Authenticating user session..." />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--danger)', marginBottom: '1rem' }}>
          403 - Unauthorized Access
        </h2>
        <p style={{ color: 'var(--gray-600)', marginBottom: '1.5rem' }}>
          You do not have administrative privileges to access this management console.
        </p>
        <Navigate to="/dashboard" replace />
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
