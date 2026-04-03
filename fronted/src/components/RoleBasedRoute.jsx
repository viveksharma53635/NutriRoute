import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";

const RoleBasedRoute = ({ children, requiredRole, adminRoute = false, coachRoute = false }) => {
  const { isAuthenticated, isLoading, hasRole, isAdmin, isUser, isCoach } = useContext(LoginContext);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access
  let hasAccess = false;

  if (requiredRole) {
    hasAccess = hasRole(requiredRole);
  } else if (adminRoute) {
    hasAccess = isAdmin();
  } else if (coachRoute) {
    hasAccess = isCoach();
  }

  // If user doesn't have required role, redirect to appropriate dashboard
  if (!hasAccess) {
    if (isAdmin()) {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (isCoach()) {
      return <Navigate to="/coach/dashboard" replace />;
    } else if (isUser()) {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default RoleBasedRoute;
