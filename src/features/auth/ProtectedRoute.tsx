import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login while saving the attempted url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role is client and subscription status is not active, force redirect to /checkout
  if (user?.role === 'client' && user?.subscriptionStatus !== 'active' && location.pathname !== '/checkout') {
    return <Navigate to="/checkout" replace />;
  }

  // If role is client, subscription status IS active, and trying to open /checkout, redirect to client home
  if (user?.role === 'client' && user?.subscriptionStatus === 'active' && location.pathname === '/checkout') {
    return <Navigate to="/client" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
