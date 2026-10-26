import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import Loader from './Loader';
import UnauthorizedPage from '../pages/UnauthorizedPage';

/**
 * ProtectedRoute Component
 * - Redirects unauthenticated users to /login preserving intended destination
 * - Checks user role against allowedRoles
 * - Shows 403 UnauthorizedPage when the user lacks the required role
 */
export default function ProtectedRoute({ allowedRoles = null, children = null }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader fullPage message="Verifying authentication credentials..." />;
  }

  // Not logged in -> redirect to login with saved return path
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role restriction check
  if (allowedRoles && Array.isArray(allowedRoles) && !allowedRoles.includes(user.role)) {
    return <UnauthorizedPage requiredRoles={allowedRoles} />;
  }

  return children || <Outlet />;
}
