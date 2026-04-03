import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import CalorieCard from "../components/CalorieCard";
import MetricsCard from "../components/MetricsCard";
import MealList from "../components/MealList";
import axios from "axios";

const UserDashboard = () => {
  const [meals, setMeals] = useState([]);
  const [todayCalories, setTodayCalories] = useState(0);
  const [user, setUser] = useState({
    name: "User",
    dailyGoal: 2000,
    protein: 50,
    carbs: 250,
    fats: 65
  });
  const [water, setWater] = useState(0);
  const [currentDietPlan, setCurrentDietPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch today's meal logs
  const fetchTodayMeals = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/meal-log/today', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMeals(response.data);
      
      // Calculate total calories
      const totalCalories = response.data.reduce((sum, meal) => sum + meal.caloriesConsumed, 0);
      setTodayCalories(totalCalories);
    } catch (error) {
      console.error('Error fetching today\'s meals:', error);
    }
  };

  // Fetch current diet plan
  const fetchCurrentDietPlan = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/user/diet-plan/current', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data) {
        setCurrentDietPlan(response.data);
        setUser(prev => ({
          ...prev,
          dailyGoal: response.data.dietPlan.targetCaloriesPerDay,
          protein: response.data.dietPlan.targetProteinPerDay,
          carbs: response.data.dietPlan.targetCarbsPerDay,
          fats: response.data.dietPlan.targetFatPerDay
        }));
      }
    } catch (error) {
      console.error('Error fetching current diet plan:', error);
    }
  };

  // Quick add meal
  const handleQuickAdd = async () => {
    try {
      const token = localStorage.getItem('token');
      const newMeal = {
        mealId: "default-snack-id", // You might want to show a modal to select a meal
        caloriesConsumed: 200,
        consumedAt: new Date().toISOString()
      };

      const response = await axios.post('/api/meal-log', newMeal, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMeals(prev => [...prev, response.data]);
      setTodayCalories(prev => prev + 200);
    } catch (error) {
      console.error('Error adding meal:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchTodayMeals(), fetchCurrentDietPlan()]);
      setLoading(false);
    };

    fetchData();

    // Load water from localStorage
    const savedWater = localStorage.getItem("water");
    if (savedWater) {
      setWater(parseInt(savedWater));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("water", water);
  }, [water]);

  const remainingCalories = user.dailyGoal - todayCalories;
  const progress = Math.min((todayCalories / user.dailyGoal) * 100, 100);

  const progressColor =
    progress < 50
      ? "bg-warning"
      : progress < 90
        ? "bg-success"
        : "bg-danger";

  if (loading) {
    return (
      <div className="container-fluid bg-light py-4" style={{ minHeight: "100vh" }}>
        <div className="container text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid bg-light py-4" style={{ minHeight: "100vh" }}>
      <div className="container">
        {/* HEADER */}
        <div className="row mb-4">
          <div className="col-md-8">
            <h2 className="fw-bold">Hello, {user.name}</h2>
            {currentDietPlan && (
              <h6 className="text-muted">
                Current Plan: <span className="badge bg-primary">{currentDietPlan.dietPlan.name}</span>
              </h6>
            )}
            <p className="text-muted">
              Goal: <b>{currentDietPlan?.dietPlan.type || 'Custom'}</b>
            </p>
          </div>
          <div className="col-md-4 text-md-end">
            <button onClick={handleQuickAdd} className="btn btn-success shadow">
              + Quick Add Snack
            </button>
          </div>
        </div>

        <div className="row g-4">
          <CalorieCard
            user={{ ...user, consumed: todayCalories }}
            progress={progress}
            progressColor={progressColor}
            remainingCalories={remainingCalories}
          />

          <MetricsCard
            user={user}
            plan={currentDietPlan?.dietPlan?.name || "FREE"}
            water={water}
            setWater={setWater}
          />

          <MealList meals={meals.map(meal => ({
            id: meal.id,
            name: meal.meal?.name || "Unknown Meal",
            calories: meal.caloriesConsumed,
            protein: meal.meal?.protein || 0,
            time: new Date(meal.consumedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }))} />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
