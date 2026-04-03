import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../context/LoginContext';
import { authService } from '../services/apiService';
import 'bootstrap/dist/css/bootstrap.min.css';

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const { user, updateSubscription } = useContext(LoginContext);
  const [plans, setPlans] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchPlans();
    fetchCurrentSubscription();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await api.get('/api/subscription/plans');
      setPlans(response.data.plans);
    } catch (error) {
      console.error('Error fetching plans:', error);
      setError('Failed to load subscription plans');
    }
  };

  const fetchCurrentSubscription = async () => {
    try {
      const response = await api.get('/api/subscription/current');
      setCurrentSubscription(response.data);
    } catch (error) {
      console.error('Error fetching current subscription:', error);
    }
  };

  const upgradeSubscription = async (planType) => {
    if (!user) {
      navigate('/signin');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/api/subscription/upgrade', {
        planType: planType
      });

      // Update subscription in context
      updateSubscription({
        subscriptionPlan: planType
      });

      setSuccess(`Successfully upgraded to ${planType} plan!`);
      
      // Refresh current subscription
      await fetchCurrentSubscription();
      
      // Navigate to dashboard after successful upgrade
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      setError(error.response?.data?.message || 'Failed to upgrade subscription');
    } finally {
      setLoading(false);
    }
  };

  const getPlanIcon = (planType) => {
    switch (planType) {
      case 'FREE':
        return 'bi-star';
      case 'PRO':
        return 'bi-star-fill';
      case 'PREMIUM':
        return 'bi-gem';
      default:
        return 'bi-circle';
    }
  };

  const getPlanColor = (planType) => {
    switch (planType) {
      case 'FREE':
        return 'secondary';
      case 'PRO':
        return 'success';
      case 'PREMIUM':
        return 'primary';
      default:
        return 'secondary';
    }
  };

  const isCurrentPlan = (planType) => {
    return currentSubscription?.planType === planType;
  };

  const canUpgrade = (planType) => {
    if (!currentSubscription) return true;
    
    const planOrder = ['FREE', 'PRO', 'PREMIUM'];
    const currentIndex = planOrder.indexOf(currentSubscription.planType);
    const targetIndex = planOrder.indexOf(planType);
    
    return targetIndex > currentIndex;
  };

  if (!user) {
    return (
      <div className="container-fluid py-5 bg-light min-vh-100">
        <div className="container text-center">
          <h2>Please log in to view subscription plans</h2>
          <button 
            className="btn btn-primary mt-3"
            onClick={() => navigate('/signin')}
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-5 bg-light min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold mb-3">Choose Your Nutrition Plan</h1>
          <p className="lead text-muted">
            Unlock premium features and take your health journey to the next level
          </p>
          
          {currentSubscription && (
            <div className="alert alert-info d-inline-block" role="alert">
              <i className="bi bi-info-circle me-2"></i>
              Current plan: <strong>{currentSubscription.displayName}</strong>
            </div>
          )}
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="alert alert-danger" role="alert">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
                <button 
                  type="button" 
                  className="btn-close float-end" 
                  onClick={() => setError('')}
                ></button>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="alert alert-success" role="alert">
                <i className="bi bi-check-circle me-2"></i>
                {success}
              </div>
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="row g-4 mb-5">
          {plans.map((plan, index) => (
            <div key={index} className="col-lg-4 col-md-6">
              <div className={`card h-100 ${plan.code === 'PRO' ? 'border-success shadow-lg' : 'border-0 shadow-sm'}`}>
                {plan.code === 'PRO' && (
                  <div className="card-header bg-success text-white text-center py-2">
                    <span className="badge bg-warning text-dark">POPULAR</span>
                  </div>
                )}
                
                <div className="card-body d-flex flex-column">
                  {/* Plan Header */}
                  <div className="text-center mb-4">
                    <div className={`text-${getPlanColor(plan.code)} mb-3`}>
                      <i className={`bi ${getPlanIcon(plan.code)} fs-1`}></i>
                    </div>
                    <h3 className="card-title">{plan.displayName}</h3>
                    <div className="display-6 fw-bold text-primary mb-2">
                      ${plan.price}
                      <small className="text-muted fw-normal fs-6">/{plan.period}</small>
                    </div>
                    <p className="text-muted">{plan.description}</p>
                  </div>

                  {/* Features List */}
                  <ul className="list-group list-group-flush mb-4 flex-grow-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="list-group-item border-0 px-0">
                        <i className="bi bi-check-circle text-success me-2"></i>
                        {formatFeatureName(feature)}
                      </li>
                    ))}
                  </ul>

                  {/* Action Button */}
                  <div className="mt-auto">
                    <button
                      className={`btn w-100 btn-lg ${
                        isCurrentPlan(plan.code) 
                          ? 'btn-secondary' 
                          : canUpgrade(plan.code)
                            ? `btn-${getPlanColor(plan.code)}`
                            : 'btn-outline-secondary'
                      }`}
                      onClick={() => upgradeSubscription(plan.code)}
                      disabled={isCurrentPlan(plan.code) || !canUpgrade(plan.code) || loading}
                    >
                      {loading && !isCurrentPlan(plan.code) && canUpgrade(plan.code) ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Processing...
                        </>
                      ) : (
                        <>
                          {isCurrentPlan(plan.code) ? (
                            <>
                              Current Plan
                              <i className="bi bi-check-circle ms-2"></i>
                            </>
                          ) : !canUpgrade(plan.code) ? (
                            'Downgrade Not Available'
                          ) : (
                            `Upgrade to ${plan.displayName}`
                          )}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white">
                <h4 className="card-title mb-0">
                  <i className="bi bi-table me-2"></i>
                  Feature Comparison
                </h4>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Feature</th>
                        <th className="text-center">Free</th>
                        <th className="text-center">Pro</th>
                        <th className="text-center">Premium</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Basic Diet Plan</td>
                        <td className="text-center">
                          <i className="bi bi-check-circle text-success"></i>
                        </td>
                        <td className="text-center">
                          <i className="bi bi-check-circle text-success"></i>
                        </td>
                        <td className="text-center">
                          <i className="bi bi-check-circle text-success"></i>
                        </td>
                      </tr>
                      <tr>
                        <td>Advanced Meals</td>
                        <td className="text-center">
                          <i className="bi bi-x-circle text-danger"></i>
                        </td>
                        <td className="text-center">
                          <i className="bi bi-check-circle text-success"></i>
                        </td>
                        <td className="text-center">
                          <i className="bi bi-check-circle text-success"></i>
                        </td>
                      </tr>
                      <tr>
                        <td>Nutrition Tracking</td>
                        <td className="text-center">
                          <i className="bi bi-x-circle text-danger"></i>
                        </td>
                        <td className="text-center">
                          <i className="bi bi-check-circle text-success"></i>
                        </td>
                        <td className="text-center">
                          <i className="bi bi-check-circle text-success"></i>
                        </td>
                      </tr>
                      <tr>
                        <td>AI Diet Recommendation</td>
                        <td className="text-center">
                          <i className="bi bi-x-circle text-danger"></i>
                        </td>
                        <td className="text-center">
                          <i className="bi bi-x-circle text-danger"></i>
                        </td>
                        <td className="text-center">
                          <i className="bi bi-check-circle text-success"></i>
                        </td>
                      </tr>
                      <tr>
                        <td>Custom Diet Plan</td>
                        <td className="text-center">
                          <i className="bi bi-x-circle text-danger"></i>
                        </td>
                        <td className="text-center">
                          <i className="bi bi-x-circle text-danger"></i>
                        </td>
                        <td className="text-center">
                          <i className="bi bi-check-circle text-success"></i>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white">
                <h4 className="card-title mb-0">
                  <i className="bi bi-question-circle me-2"></i>
                  Frequently Asked Questions
                </h4>
              </div>
              <div className="card-body">
                <div className="accordion" id="faqAccordion">
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="faq1">
                      <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse1">
                        Can I change my plan anytime?
                      </button>
                    </h2>
                    <div id="collapse1" className="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                      <div className="accordion-body">
                        Yes! You can upgrade your subscription at any time. Downgrades are not currently supported through the web interface.
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="faq2">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse2">
                        What happens when I upgrade?
                      </button>
                    </h2>
                    <div id="collapse2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                      <div className="accordion-body">
                        You'll get immediate access to all features included in your new plan. Your subscription renews monthly at the new plan price.
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <h2 className="accordion-header" id="faq3">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse3">
                        Is there a free trial?
                      </button>
                    </h2>
                    <div id="collapse3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                      <div className="accordion-body">
                        The FREE plan is always available with basic features. You can upgrade to paid plans anytime to unlock premium features.
                      </div>
                    </div>
                  </div>
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

export default SubscriptionPage;
