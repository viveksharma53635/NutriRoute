import React, { useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoginContext } from '../context/LoginContext';

const RoleBasedRedirect = () => {
  const { user, isAuthenticated, isAdmin, isUser, isLoading } = useContext(LoginContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect if authenticated and not loading
    if (isAuthenticated && !isLoading && user) {
      const from = location.state?.from?.pathname;
      
      // If there's a stored redirect location, use it
      if (from && from !== '/login' && from !== '/register') {
        navigate(from, { replace: true });
        return;
      }

      // Role-based redirection logic
      if (isAdmin()) {
        navigate('/admin/dashboard', { replace: true });
      } else if (isUser()) {
        navigate('/dashboard', { replace: true });
      } else {
        // Fallback to home if role is unknown
        navigate('/', { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, user, isAdmin, isUser, navigate, location]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // If not authenticated, this component shouldn't render anything
  // The ProtectedRoute will handle the redirect to login
  return null;
};

export default RoleBasedRedirect;
