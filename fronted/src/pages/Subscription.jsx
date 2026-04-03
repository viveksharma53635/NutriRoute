import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";
import { authService } from "../services/apiService";
import "bootstrap/dist/css/bootstrap.min.css";

const Subscription = () => {
  const navigate = useNavigate();
  const { user, subscriptionType, updateSubscription, refreshSubscription } = useContext(LoginContext);

  const [plans, setPlans] = useState([]);
  const [currentPlan, setCurrentPlan] = useState("FREE");
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [processingPlan, setProcessingPlan] = useState("");

  const fallbackPlans = [
    { code: "FREE", displayName: "Free", price: 0, features: ["Basic diet suggestions", "Limited meal tracking"] },
    { code: "PRO", displayName: "Pro", price: 499, features: ["Personalized diet plan", "Advanced analytics", "AI diet recommendation"] },
    { code: "PREMIUM", displayName: "Premium", price: 999, features: ["Everything in Pro", "Coach Chat access"] }
  ];

  useEffect(() => {
    loadData();
    loadRazorpayScript();
  }, []);

  const loadData = async () => {
    try {
      setLoadingPlan(true);
      let loadedPlans = fallbackPlans;
      let loadedCurrentPlan = subscriptionType || "FREE";

      try {
        const plansRes = await authService.getSubscriptionPlans();
        if (plansRes?.data?.plans?.length) {
          loadedPlans = plansRes.data.plans;
        }
      } catch {
        setInfo("Subscription plans loaded in fallback mode.");
      }

      try {
        const currentRes = await authService.getCurrentSubscription();
        if (currentRes?.data?.planType) {
          loadedCurrentPlan = currentRes.data.planType;
        }
      } catch (err) {
        loadedCurrentPlan = subscriptionType || "FREE";
        if (err?.response?.status === 401) {
          setInfo("Session issue: could not load subscription status. Please re-login if this continues.");
        }
      }

      setPlans(loadedPlans);
      setCurrentPlan(loadedCurrentPlan);
    } catch (e) {
      setPlans(fallbackPlans);
      setCurrentPlan(subscriptionType || "FREE");
      setError("Failed to load subscription details from server. Showing fallback plans.");
    } finally {
      setLoadingPlan(false);
    }
  };

  const loadRazorpayScript = () => {
    if (window.Razorpay) return;
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  };

  const planIndex = useMemo(() => ({ FREE: 0, PRO: 1, PREMIUM: 2 }), []);

  const startUpgrade = async (planCode) => {
    if (!user) {
      navigate("/login");
      return;
    }

    if ((planIndex[planCode] || 0) <= (planIndex[currentPlan] || 0)) {
      return;
    }

    setError("");
    setInfo("");
    setProcessingPlan(planCode);
    const selected = plans.find((p) => p.code === planCode) || { code: planCode, displayName: planCode, price: 0, features: [] };
    navigate("/payment", { state: { plan: selected } });
    setProcessingPlan("");
  };

  if (loadingPlan) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-success" role="status" />
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <h2>Subscription</h2>
        <p className="text-muted mb-1">Current Plan: <b>{currentPlan}</b></p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {info && <div className="alert alert-info">{info}</div>}

      <div className="row g-4">
        {plans.map((plan) => {
          const isCurrent = currentPlan === plan.code;
          const disabled = isCurrent || (planIndex[plan.code] || 0) <= (planIndex[currentPlan] || 0);

          return (
            <div className="col-md-4" key={plan.code}>
              <div className={`card h-100 ${isCurrent ? "border-success" : ""}`}>
                <div className="card-body d-flex flex-column">
                  <h4>{plan.displayName}</h4>
                  <h5 className="text-success">Rs {plan.price}/month</h5>
                  <ul className="mt-3 mb-4">
                    {(plan.features || []).map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>

                  <button
                    className={`btn mt-auto ${isCurrent ? "btn-secondary" : "btn-success"}`}
                    disabled={disabled || processingPlan === plan.code}
                    onClick={() => startUpgrade(plan.code)}
                  >
                    {isCurrent ? "Current Plan" : processingPlan === plan.code ? "Processing..." : `Upgrade to ${plan.displayName}`}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Subscription;
