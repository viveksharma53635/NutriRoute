import "bootstrap/dist/css/bootstrap.min.css";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CalorieCard from "../components/CalorieCard";
import MetricsCard from "../components/MetricsCard";
import MealList from "../components/MealList";
import { LoginContext } from "../context/LoginContext";

const Dashboard = () => {
  const { user, subscriptionType, subscriptionEndDate, isPremiumUser, isProUser } = useContext(LoginContext);

  const [meals, setMeals] = useState([
    { id: 1, name: "Oatmeal & Berries", calories: 350, protein: 10, time: "08:30 AM" },
    { id: 2, name: "Paneer Salad", calories: 450, protein: 25, time: "01:15 PM" }
  ]);

  const [water, setWater] = useState(0);
  const [modelUser, setModelUser] = useState({
    name: user?.name || "User",
    age: user?.age || 22,
    weight: user?.weightKg || 73,
    height: user?.heightCm || 165,
    goalType: user?.fitnessGoal || "Muscle Gain",
    dailyGoal: user?.dailyCalorieTarget || 2200,
    consumed: 1540,
    protein: 80,
    carbs: 150,
    fats: 45
  });

  useEffect(() => {
    const savedWater = localStorage.getItem("water");
    if (savedWater) {
      setWater(parseInt(savedWater, 10));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("water", String(water));
  }, [water]);

  useEffect(() => {
    if (!user) return;
    setModelUser((prev) => ({
      ...prev,
      name: user.name || prev.name,
      age: user.age || prev.age,
      weight: user.weightKg || prev.weight,
      height: user.heightCm || prev.height,
      goalType: user.fitnessGoal || prev.goalType,
      dailyGoal: user.dailyCalorieTarget || prev.dailyGoal
    }));
  }, [user]);

  const remainingCalories = modelUser.dailyGoal - modelUser.consumed;
  const progress = Math.min((modelUser.consumed / modelUser.dailyGoal) * 100, 100);

  const progressColor = progress < 50 ? "bg-warning" : progress < 90 ? "bg-success" : "bg-danger";
  const bmi = (modelUser.weight / ((modelUser.height / 100) ** 2)).toFixed(1);

  const premiumFeatures = useMemo(
    () => ["AI Diet Analysis", "Coach Chat", "Advanced Analytics"],
    []
  );

  const handleQuickAdd = () => {
    const newMeal = {
      id: Date.now(),
      name: "Healthy Snack",
      calories: 200,
      protein: 8,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMeals((prev) => [...prev, newMeal]);
    setModelUser((prev) => ({
      ...prev,
      consumed: prev.consumed + 200,
      protein: prev.protein + 8
    }));
  };

  return (
    <div className="container-fluid bg-light py-4 px-4 px-xl-5" style={{ minHeight: "100vh" }}>
        <div className="row mb-4">
          <div className="col-md-8">
            <h2 className="fw-bold">Welcome {modelUser.name} ??</h2>
            <h6 className="text-muted mb-1">
              Current Plan: <span className="badge bg-primary">{subscriptionType || "FREE"}</span>
            </h6>
            <h6 className="text-muted mb-2">Expires: {subscriptionEndDate || "N/A"}</h6>
            <p className="text-muted">
              Goal: <b>{modelUser.goalType}</b> | BMI: <b>{bmi}</b>
            </p>
          </div>
          <div className="col-md-4 text-md-end">
            <button onClick={handleQuickAdd} className="btn btn-success shadow">
              + Quick Add Snack
            </button>
          </div>
        </div>

        {!isPremiumUser() && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
                  <div>
                    <h5 className="mb-2">Upgrade to Premium to unlock:</h5>
                    <div className="d-flex flex-wrap gap-2">
                      {premiumFeatures.map((item) => (
                        <span key={item} className="badge bg-light text-dark border">{item}</span>
                      ))}
                    </div>
                  </div>
                  <Link to="/subscription" className="btn btn-primary">Upgrade Plan</Link>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="row g-4">
          <CalorieCard
            user={modelUser}
            progress={progress}
            progressColor={progressColor}
            remainingCalories={remainingCalories}
          />

          <MetricsCard
            user={modelUser}
            plan={subscriptionType || "FREE"}
            water={water}
            setWater={setWater}
          />

          <MealList meals={meals} />
        </div>

        {(isProUser() || isPremiumUser()) && (
          <div className="mt-4">
            <Link to="/analytics" className="btn btn-outline-secondary me-2">Open Analytics</Link>
          </div>
        )}
    </div>
  );
};

export default Dashboard;
