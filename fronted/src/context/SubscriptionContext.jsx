import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/apiService';

const SubscriptionContext = createContext(null);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider = ({ children }) => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Subscription hierarchy: FREE < PRO < PREMIUM
  const subscriptionHierarchy = ['FREE', 'PRO', 'PREMIUM'];

  useEffect(() => {
    fetchCurrentSubscription();
  }, []);

  const fetchCurrentSubscription = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/subscription/current');
      setSubscription(response.data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
      setError('Failed to load subscription information');
    } finally {
      setLoading(false);
    }
  };

  const upgradeSubscription = async (planType) => {
    try {
      setLoading(true);
      const response = await api.post('/api/subscription/upgrade', {
        planType: planType
      });
      setSubscription(response.data);
      return response.data;
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const checkFeatureAccess = async (feature) => {
    try {
      const response = await api.get(`/api/subscription/check-feature/${feature}`);
      return response.data.hasAccess;
    } catch (error) {
      console.error('Error checking feature access:', error);
      return false;
    }
  };

  const checkSubscriptionAccess = async (requiredPlan) => {
    try {
      const response = await api.get(`/api/subscription/check-access/${requiredPlan}`);
      return response.data.hasAccess;
    } catch (error) {
      console.error('Error checking subscription access:', error);
      return false;
    }
  };

  // Helper functions
  const hasFeatureAccess = (feature) => {
    if (!subscription || !subscription.features) return false;
    return subscription.features.includes(feature);
  };

  const hasSubscriptionAccess = (requiredPlan) => {
    if (!subscription || !subscription.planType) return false;
    
    const userLevel = subscriptionHierarchy.indexOf(subscription.planType);
    const requiredLevel = subscriptionHierarchy.indexOf(requiredPlan);
    
    return userLevel >= requiredLevel;
  };

  const isFreeUser = () => subscription?.planType === 'FREE';
  const isProUser = () => subscription?.planType === 'PRO';
  const isPremiumUser = () => subscription?.planType === 'PREMIUM';
  const isPaidUser = () => isProUser() || isPremiumUser();

  const getRequiredPlanForFeature = (feature) => {
    const featureRequirements = {
      'basic_diet_plan': 'FREE',
      'advanced_meals': 'PRO',
      'nutrition_tracking': 'PRO',
      'ai_diet_recommendation': 'PREMIUM',
      'custom_diet_plan': 'PREMIUM'
    };
    return featureRequirements[feature] || 'PREMIUM';
  };

  const canAccessFeature = (feature) => {
    const requiredPlan = getRequiredPlanForFeature(feature);
    return hasSubscriptionAccess(requiredPlan);
  };

  const getUpgradePrompt = (feature) => {
    const requiredPlan = getRequiredPlanForFeature(feature);
    return `This feature requires a ${requiredPlan} subscription. Upgrade to unlock this feature.`;
  };

  const refreshSubscription = () => {
    fetchCurrentSubscription();
  };

  const value = {
    subscription,
    loading,
    error,
    fetchCurrentSubscription,
    upgradeSubscription,
    checkFeatureAccess,
    checkSubscriptionAccess,
    hasFeatureAccess,
    hasSubscriptionAccess,
    isFreeUser,
    isProUser,
    isPremiumUser,
    isPaidUser,
    canAccessFeature,
    getRequiredPlanForFeature,
    getUpgradePrompt,
    refreshSubscription
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export default SubscriptionContext;
