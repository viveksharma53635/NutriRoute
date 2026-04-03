import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";
import { authService } from "../services/apiService";
import "bootstrap/dist/css/bootstrap.min.css";

const PaymentFlow = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, updateSubscription, refreshSubscription } = useContext(LoginContext);

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const statePlan = location.state?.plan;
    const savedPlan = localStorage.getItem("selectedPlan");

    if (statePlan) {
      setSelectedPlan(statePlan);
      localStorage.setItem("selectedPlan", JSON.stringify(statePlan));
    } else if (savedPlan) {
      setSelectedPlan(JSON.parse(savedPlan));
    }
  }, [location.state]);

  useEffect(() => {
    if (window.Razorpay) return;
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePay = async () => {
    if (!selectedPlan) return;
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    if (!token || token === "undefined" || token === "null") {
      setError("Session issue: token is missing. Please login again if this continues.");
      return;
    }
    if (!window.Razorpay) {
      setError("Razorpay SDK failed to load. Please refresh and try again.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const orderResponse = await authService.createRazorpayOrder(selectedPlan.code);
      const orderData = orderResponse.data;

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "NutriRoute",
        description: `${selectedPlan.displayName} Subscription`,
        order_id: orderData.orderId,
        prefill: {
          name: user?.fullName || "",
          email: user?.email || ""
        },
        theme: {
          color: "#198754"
        },
        handler: async function (response) {
          try {
            const verifyPayload = {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature
            };
            const verifyRes = await authService.verifyRazorpayPayment(verifyPayload);
            const verified = verifyRes?.data;

            updateSubscription({
              planType: verified?.plan || selectedPlan.code,
              endDate: verified?.endDate || null,
              isActive: true
            });
            await refreshSubscription();
            localStorage.removeItem("selectedPlan");
            navigate("/userdashboard");
          } catch (verifyError) {
            setError(verifyError?.response?.data?.message || "Payment verification failed.");
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        setError(response?.error?.description || "Payment failed. Please try again.");
        setLoading(false);
      });
      rzp.open();
    } catch (e) {
      const isUnauthorized = e?.response?.status === 401;
      const backendMessage = e?.response?.data?.message || e?.response?.data?.error || "";
      setError(
        isUnauthorized
          ? (backendMessage || "Session issue: unable to start payment right now. Please re-login if this continues.")
          : (e?.response?.data?.message || "Unable to start payment. Please try again.")
      );
      setLoading(false);
    }
  };

  if (!selectedPlan) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">Please select a plan from Subscription page first.</div>
        <button className="btn btn-primary" onClick={() => navigate("/subscription")}>
          Go to Subscription
        </button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card border-0 shadow">
            <div className="card-header bg-white">
              <h5 className="mb-0">Payment</h5>
            </div>
            <div className="card-body">
              <h4 className="mb-3">{selectedPlan.displayName}</h4>
              <p className="text-muted mb-4">Amount: Rs {selectedPlan.price} / month</p>

              {error && <div className="alert alert-danger">{error}</div>}

              <button className="btn btn-success w-100" disabled={loading} onClick={handlePay}>
                {loading ? "Opening Razorpay..." : `Pay Rs ${selectedPlan.price}`}
              </button>

              {loading && (
                <div className="text-center mt-4">
                  <div className="spinner-border text-success" role="status" />
                  <p className="mt-2 mb-0">Processing payment...</p>
                </div>
              )}

              <button className="btn btn-link mt-3 p-0" onClick={() => navigate("/subscription")}>
                Back to plans
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFlow;
