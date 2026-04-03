import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LoginContext } from '../context/LoginContext';
import SubscriptionGuard from '../components/SubscriptionGuard';
import { authService } from '../services/apiService';
import 'bootstrap/dist/css/bootstrap.min.css';

const EnhancedDashboard = () => {
  const { user, subscriptionType, isFreeUser, isProUser, isPremiumUser } = useContext(LoginContext);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/user/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h3 mb-1">Dashboard</h1>
              <p className="text-muted mb-0">Welcome back, {user?.name}!</p>
            </div>
            <div className="d-flex align-items-center gap-3">
              <div className="text-end">
                <small className="text-muted">Current Plan</small>
                <div>
                  <span className={`badge bg-${
                    isFreeUser() ? 'secondary' : 
                    isProUser() ? 'success' : 
                    'primary'
                  }`}>
                    {subscriptionType || 'FREE'}
                  </span>
                </div>
              </div>
              <Link to="/subscription" className="btn btn-outline-primary">
                <i className="bi bi-arrow-up-circle me-2"></i>
                Upgrade
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* User Stats */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="text-primary mb-2">
                <i className="bi bi-person fs-1"></i>
              </div>
              <h6 className="text-muted">BMI</h6>
              <h4 className="fw-bold">{user?.heightCm && user?.weightKg ? 
                (user.weightKg / Math.pow(user.heightCm / 100, 2)).toFixed(1) : 'N/A'
              }</h4>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="text-success mb-2">
                <i className="bi bi-fire fs-1"></i>
              </div>
              <h6 className="text-muted">Daily Calories</h6>
              <h4 className="fw-bold">{user?.dailyCalorieTarget || 'N/A'}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="text-warning mb-2">
                <i className="bi bi-egg-fried fs-1"></i>
              </div>
              <h6 className="text-muted">Meals Logged</h6>
              <h4 className="fw-bold">{dashboardData?.todayMealCount || 0}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="text-info mb-2">
                <i className="bi bi-calendar-check fs-1"></i>
              </div>
              <h6 className="text-muted">Days Active</h6>
              <h4 className="fw-bold">15</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Nutrition Summary */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0">
                <i className="bi bi-pie-chart me-2"></i>
                Today's Nutrition Summary
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Calories</span>
                    <strong>{dashboardData?.todayTotals?.calories || 0}</strong>
                  </div>
                  <div className="progress" style={{height: '8px'}}>
                    <div 
                      className="progress-bar bg-success" 
                      style={{width: `${Math.min((dashboardData?.todayTotals?.calories || 0) / (user?.dailyCalorieTarget || 2000) * 100, 100)}%`}}
                    ></div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Protein</span>
                    <strong>{dashboardData?.todayTotals?.protein || 0}g</strong>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Carbs</span>
                    <strong>{dashboardData?.todayTotals?.carbs || 0}g</strong>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Fat</span>
                    <strong>{dashboardData?.todayTotals?.fat || 0}g</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="row">
        <div className="col-12">
          <h4 className="mb-4">Available Features</h4>
        </div>
      </div>

      <div className="row g-4">
        {/* Basic Diet Plan - Available for all */}
        <div className="col-md-6 col-lg-4">
          <SubscriptionGuard feature="basic_diet_plan">
            <div className="card border-0 shadow-sm h-100 feature-card">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div className="text-primary me-3">
                    <i className="bi bi-clipboard-pulse fs-3"></i>
                  </div>
                  <h5 className="card-title mb-0">Basic Diet Plan</h5>
                </div>
                <p className="text-muted mb-3">
                  Get personalized diet recommendations based on your BMI and basic health metrics.
                </p>
                <Link to="/diet-planner" className="btn btn-primary w-100">
                  <i className="bi bi-arrow-right me-2"></i>
                  Access Feature
                </Link>
              </div>
            </div>
          </SubscriptionGuard>
        </div>

        {/* Advanced Meals - Requires PRO */}
        <div className="col-md-6 col-lg-4">
          <SubscriptionGuard feature="advanced_meals">
            <div className="card border-0 shadow-sm h-100 feature-card">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div className="text-success me-3">
                    <i className="bi bi-egg-fried fs-3"></i>
                  </div>
                  <h5 className="card-title mb-0">Advanced Meals</h5>
                </div>
                <p className="text-muted mb-3">
                  Access detailed meal plans with advanced nutritional tracking and meal customization.
                </p>
                <Link to="/meal-tracker" className="btn btn-success w-100">
                  <i className="bi bi-arrow-right me-2"></i>
                  Access Feature
                </Link>
              </div>
            </div>
          </SubscriptionGuard>
        </div>

        {/* Nutrition Tracking - Requires PRO */}
        <div className="col-md-6 col-lg-4">
          <SubscriptionGuard feature="nutrition_tracking">
            <div className="card border-0 shadow-sm h-100 feature-card">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div className="text-warning me-3">
                    <i className="bi bi-graph-up fs-3"></i>
                  </div>
                  <h5 className="card-title mb-0">Nutrition Tracking</h5>
                </div>
                <p className="text-muted mb-3">
                  Track your daily nutritional intake with detailed analytics and progress charts.
                </p>
                <Link to="/progress" className="btn btn-warning w-100">
                  <i className="bi bi-arrow-right me-2"></i>
                  Access Feature
                </Link>
              </div>
            </div>
          </SubscriptionGuard>
        </div>

        {/* AI Diet Recommendation - Requires PREMIUM */}
        <div className="col-md-6 col-lg-4">
          <SubscriptionGuard feature="ai_diet_recommendation">
            <div className="card border-0 shadow-sm h-100 feature-card">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div className="text-info me-3">
                    <i className="bi bi-robot fs-3"></i>
                  </div>
                  <h5 className="card-title mb-0">AI Diet Recommendations</h5>
                </div>
                <p className="text-muted mb-3">
                  Get AI-powered personalized diet recommendations based on your health goals.
                </p>
                <button className="btn btn-info w-100" disabled>
                  <i className="bi bi-arrow-right me-2"></i>
                  Coming Soon
                </button>
              </div>
            </div>
          </SubscriptionGuard>
        </div>

        {/* Custom Diet Plan - Requires PREMIUM */}
        <div className="col-md-6 col-lg-4">
          <SubscriptionGuard feature="custom_diet_plan">
            <div className="card border-0 shadow-sm h-100 feature-card">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div className="text-primary me-3">
                    <i className="bi bi-gear fs-3"></i>
                  </div>
                  <h5 className="card-title mb-0">Custom Diet Plan</h5>
                </div>
                <p className="text-muted mb-3">
                  Create fully customized diet plans tailored to your specific dietary needs.
                </p>
                <button className="btn btn-primary w-100" disabled>
                  <i className="bi bi-arrow-right me-2"></i>
                  Coming Soon
                </button>
              </div>
            </div>
          </SubscriptionGuard>
        </div>
      </div>

      {/* Subscription Status */}
      <div className="row mt-5">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0">
                <i className="bi bi-info-circle me-2"></i>
                Subscription Status
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h6>Current Plan Benefits:</h6>
                  <ul className="list-unstyled">
                    {dashboardData?.availableFeatures?.map((feature, index) => (
                      <li key={index} className="mb-2">
                        <i className="bi bi-check-circle text-success me-2"></i>
                        {formatFeatureName(feature)}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="col-md-6">
                  <h6>Upgrade Options:</h6>
                  <div className="d-flex gap-2 mb-3">
                    {isFreeUser() && (
                      <Link to="/subscription" className="btn btn-success">
                        Upgrade to Pro
                      </Link>
                    )}
                    {isProUser() && (
                      <Link to="/subscription" className="btn btn-primary">
                        Upgrade to Premium
                      </Link>
                    )}
                    <Link to="/subscription" className="btn btn-outline-secondary">
                      View All Plans
                    </Link>
                  </div>
                  <small className="text-muted">
                    Unlock more features by upgrading your subscription plan.
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to format feature names
const formatFeatureName = (feature) => {
  switch (feature) {
    case 'basic_diet_plan':
      return 'Basic Diet Plan';
    case 'advanced_meals':
      return 'Advanced Meals';
    case 'nutrition_tracking':
      return 'Nutrition Tracking';
    case 'ai_diet_recommendation':
      return 'AI Diet Recommendations';
    case 'custom_diet_plan':
      return 'Custom Diet Plans';
    default:
      return feature.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
  }
};

export default EnhancedDashboard;
