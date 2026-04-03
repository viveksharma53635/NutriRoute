import React, { useContext } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";

function ProtectedRoute({ children, requiredPlan = null, requiredRole = null }) {
  const { isAuthenticated, isLoading, hasSubscriptionAccess, hasRole } = useContext(LoginContext);
  const location = useLocation();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requiredPlan && !hasSubscriptionAccess(requiredPlan)) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-7">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4 text-center">
                <h4 className="mb-3">This feature requires a Premium subscription.</h4>
                <p className="text-muted mb-4">Upgrade your plan to continue.</p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/subscription", { state: { from: location.pathname } })}
                >
                  Go to Subscription
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;
