import React, { createContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services/apiService";

export const LoginContext = createContext(null);

const planOrder = ["FREE", "PRO", "PREMIUM"];

export const LoginProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionType, setSubscriptionType] = useState("FREE");
  const [subscriptionEndDate, setSubscriptionEndDate] = useState(null);
  const [isSubscriptionActive, setIsSubscriptionActive] = useState(true);

  useEffect(() => {
    // Prevent stale "already logged in" state from old persistent storage.
    if (!sessionStorage.getItem("token")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    const storedToken = sessionStorage.getItem("token");
    const storedUser = sessionStorage.getItem("user");
    const normalizedStoredToken =
      storedToken && storedToken !== "undefined" && storedToken !== "null"
        ? (storedToken.trim().startsWith("Bearer ") ? storedToken.trim().substring(7).trim() : storedToken.trim())
        : null;
    const validToken = normalizedStoredToken;

    if (!validToken || !storedUser) {
      setIsLoading(false);
      return;
    }

    try {
      const parsed = JSON.parse(storedUser);
      setToken(validToken);
      setUser(parsed);
      setAuthenticated(true);
      const plan = parsed.subscriptionPlan || parsed.subscriptionType || "FREE";
      setSubscriptionType(typeof plan === "string" ? plan : plan?.code || "FREE");
    } catch {
      sessionStorage.clear();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshSubscription = async () => {
    try {
      const { data } = await authService.getCurrentSubscription();
      setSubscriptionType(data.planType || "FREE");
      setSubscriptionEndDate(data.endDate || null);
      setIsSubscriptionActive(Boolean(data.isActive ?? true));
      setUser((prev) => {
        if (!prev) return prev;
        const merged = { ...prev, subscriptionPlan: data.planType || "FREE", subscriptionEndDate: data.endDate || null };
        sessionStorage.setItem("user", JSON.stringify(merged));
        return merged;
      });
    } catch {
      // keep local state
    }
  };

  const login = (userData, jwtToken) => {
    if (!jwtToken || jwtToken === "undefined" || jwtToken === "null") {
      throw new Error("Invalid token in login response");
    }
    const normalizedToken = jwtToken.trim().startsWith("Bearer ")
      ? jwtToken.trim().substring(7).trim()
      : jwtToken.trim();
    const role = userData?.role?.roleName || userData?.role;
    const plan = userData?.subscriptionPlan || "FREE";
    const normalized = { ...userData, role, subscriptionPlan: typeof plan === "string" ? plan : plan?.code || "FREE" };

    sessionStorage.setItem("token", normalizedToken);
    sessionStorage.setItem("user", JSON.stringify(normalized));

    setToken(normalizedToken);
    setUser(normalized);
    setSubscriptionType(normalized.subscriptionPlan);
    setAuthenticated(true);
  };

  const logout = () => {
    sessionStorage.clear();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    setAuthenticated(false);
    setSubscriptionType("FREE");
    setSubscriptionEndDate(null);
    setIsSubscriptionActive(false);
  };

  const updateSubscription = ({ planType, endDate, isActive }) => {
    setSubscriptionType(planType || "FREE");
    setSubscriptionEndDate(endDate || null);
    setIsSubscriptionActive(Boolean(isActive ?? true));

    if (user) {
      const updated = { ...user, subscriptionPlan: planType || "FREE", subscriptionEndDate: endDate || null };
      setUser(updated);
      sessionStorage.setItem("user", JSON.stringify(updated));
    }
  };

  const hasRole = (role) => {
    const currentRole = user?.role;
    if (!currentRole) return false;
    return currentRole === role || currentRole === `ROLE_${role}`;
  };

  const hasSubscriptionAccess = (requiredPlan) => {
    const currentIdx = planOrder.indexOf(subscriptionType || "FREE");
    const requiredIdx = planOrder.indexOf(requiredPlan || "FREE");
    if (requiredIdx <= 0) return true;
    return currentIdx >= requiredIdx && isSubscriptionActive;
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated,
      isLoading,
      subscriptionType,
      subscriptionEndDate,
      isSubscriptionActive,
      login,
      logout,
      updateSubscription,
      refreshSubscription,
      hasRole,
      isAdmin: () => hasRole("ADMIN"),
      isCoach: () => hasRole("COACH"),
      isUser: () => hasRole("USER"),
      hasSubscriptionAccess,
      isProUser: () => subscriptionType === "PRO",
      isPremiumUser: () => subscriptionType === "PREMIUM"
    }),
    [user, token, isAuthenticated, isLoading, subscriptionType, subscriptionEndDate, isSubscriptionActive]
  );

  return <LoginContext.Provider value={value}>{children}</LoginContext.Provider>;
};

