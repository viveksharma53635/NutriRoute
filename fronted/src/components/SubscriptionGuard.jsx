import React, { useContext } from 'react';
import { useSubscription } from '../context/SubscriptionContext';
import { useNavigate } from 'react-router-dom';

const SubscriptionGuard = ({ 
  plan, 
  feature, 
  children, 
  fallback = null, 
  showUpgradePrompt = true,
  customMessage = null 
}) => {
  const { 
    subscription, 
    hasSubscriptionAccess, 
    hasFeatureAccess, 
    getRequiredPlanForFeature,
    getUpgradePrompt,
    loading 
  } = useSubscription();
  const navigate = useNavigate();

  // Check if loading
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center p-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!subscription) {
    return fallback || (
      <div className="alert alert-warning" role="alert">
        <i className="bi bi-exclamation-triangle me-2"></i>
        Please log in to access this feature.
      </div>
    );
  }

  // Determine access requirements
  let hasAccess = false;
  let requiredPlan = plan;
  let requiredFeature = feature;

  if (requiredPlan) {
    hasAccess = hasSubscriptionAccess(requiredPlan);
  } else if (requiredFeature) {
    hasAccess = hasFeatureAccess(requiredFeature);
    if (!requiredPlan) {
      requiredPlan = getRequiredPlanForFeature(requiredFeature);
    }
  }

  if (hasAccess) {
    return children;
  }

  // Show fallback or upgrade prompt
  if (fallback) {
    return fallback;
  }

  // Default upgrade prompt
  return (
    <div className="subscription-guard">
      <div className="card border-0 shadow-sm">
        <div className="card-body text-center py-5">
          <div className="mb-4">
            <i className="bi bi-lock fs-1 text-muted"></i>
          </div>
          
          <h5 className="card-title mb-3">
            {customMessage || getUpgradePrompt(requiredFeature)}
          </h5>
          
          <p className="text-muted mb-4">
            Upgrade your plan to unlock premium features and get the most out of your nutrition journey.
          </p>

          {showUpgradePrompt && (
            <div className="d-flex justify-content-center gap-2">
              <button 
                className="btn btn-success"
                onClick={() => navigate('/subscription')}
              >
                <i className="bi bi-star me-2"></i>
                Upgrade Now
              </button>
              <button 
                className="btn btn-outline-secondary"
                onClick={() => window.history.back()}
              >
                Go Back
              </button>
            </div>
          )}

          <div className="mt-4">
            <small className="text-muted">
              Current plan: <span className="badge bg-secondary">{subscription.planType}</span>
              {requiredPlan && (
                <span className="ms-2">
                  Required: <span className="badge bg-primary">{requiredPlan}</span>
                </span>
              )}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionGuard;
