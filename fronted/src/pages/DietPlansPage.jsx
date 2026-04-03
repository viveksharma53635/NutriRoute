import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

const DietPlansPage = () => {
  const [dietPlans, setDietPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startingPlan, setStartingPlan] = useState(false);

  // Fetch all active diet plans
  const fetchDietPlans = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/diet-plans/active', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDietPlans(response.data);
    } catch (error) {
      console.error('Error fetching diet plans:', error);
      setError('Failed to load diet plans');
    } finally {
      setLoading(false);
    }
  };

  // Start a diet plan
  const handleStartPlan = async (planId) => {
    try {
      setStartingPlan(true);
      const token = localStorage.getItem('token');
      await axios.post('/api/user/diet-plan/start', 
        { dietPlanId: planId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Refresh current diet plan
      alert('Diet plan started successfully!');
      fetchCurrentDietPlan();
    } catch (error) {
      console.error('Error starting diet plan:', error);
      alert('Failed to start diet plan');
    } finally {
      setStartingPlan(false);
    }
  };

  // Fetch current diet plan
  const fetchCurrentDietPlan = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/user/diet-plan/current', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedPlan(response.data);
    } catch (error) {
      // No active plan
      setSelectedPlan(null);
    }
  };

  useEffect(() => {
    fetchDietPlans();
    fetchCurrentDietPlan();
  }, []);

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

  if (error) {
    return (
      <div className="container-fluid bg-light py-4" style={{ minHeight: "100vh" }}>
        <div className="container">
          <div className="alert alert-danger">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid bg-light py-4" style={{ minHeight: "100vh" }}>
      <div className="container">
        {/* HEADER */}
        <div className="row mb-4">
          <div className="col-12">
            <h2 className="fw-bold">Diet Plans</h2>
            <p className="text-muted">Choose a diet plan that fits your goals</p>
            
            {selectedPlan && (
              <div className="alert alert-success mt-3">
                <strong>Current Plan:</strong> {selectedPlan.dietPlan.name}
                <br />
                <small>Started on: {new Date(selectedPlan.startDate).toLocaleDateString()}</small>
              </div>
            )}
          </div>
        </div>

        {/* DIET PLANS GRID */}
        <div className="row g-4">
          {dietPlans.map((plan) => (
            <div key={plan.id} className="col-md-6 col-lg-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="card-title">{plan.name}</h5>
                    <span className={`badge ${
                      plan.type === 'WEIGHT_LOSS' ? 'bg-danger' :
                      plan.type === 'MUSCLE_GAIN' ? 'bg-success' :
                      plan.type === 'KETO' ? 'bg-warning' : 'bg-info'
                    }`}>
                      {plan.type.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <p className="card-text text-muted">{plan.description}</p>
                  
                  <div className="row text-center mb-3">
                    <div className="col-4">
                      <small className="text-muted">Duration</small>
                      <div className="fw-bold">{plan.durationDays} days</div>
                    </div>
                    <div className="col-4">
                      <small className="text-muted">Calories</small>
                      <div className="fw-bold">{plan.targetCaloriesPerDay}</div>
                    </div>
                    <div className="col-4">
                      <small className="text-muted">Protein</small>
                      <div className="fw-bold">{plan.targetProteinPerDay}g</div>
                    </div>
                  </div>
                  
                  <div className="row text-center mb-3">
                    <div className="col-4">
                      <small className="text-muted">Carbs</small>
                      <div className="fw-bold">{plan.targetCarbsPerDay}g</div>
                    </div>
                    <div className="col-4">
                      <small className="text-muted">Fats</small>
                      <div className="fw-bold">{plan.targetFatPerDay}g</div>
                    </div>
                    <div className="col-4">
                      <small className="text-muted">Meals</small>
                      <div className="fw-bold">{plan.meals?.length || 0}</div>
                    </div>
                  </div>

                  <div className="d-grid gap-2">
                    {selectedPlan?.dietPlanId === plan.id ? (
                      <button className="btn btn-success" disabled>
                        <i className="bi bi-check-circle me-2"></i>
                        Current Plan
                      </button>
                    ) : (
                      <button 
                        className="btn btn-primary"
                        onClick={() => handleStartPlan(plan.id)}
                        disabled={startingPlan}
                      >
                        {startingPlan ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Starting...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-play-circle me-2"></i>
                            Start Plan
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {dietPlans.length === 0 && (
          <div className="text-center py-5">
            <h4>No diet plans available</h4>
            <p className="text-muted">Check back later for new diet plans</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DietPlansPage;
