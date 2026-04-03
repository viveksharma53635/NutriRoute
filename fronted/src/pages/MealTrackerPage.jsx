import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

const MealTrackerPage = () => {
  const [meals, setMeals] = useState([]);
  const [availableMeals, setAvailableMeals] = useState([]);
  const [selectedMeal, setSelectedMeal] = useState('');
  const [caloriesConsumed, setCaloriesConsumed] = useState('');
  const [loading, setLoading] = useState(true);
  const [addingMeal, setAddingMeal] = useState(false);
  const [filter, setFilter] = useState('all');

  // Fetch today's meals
  const fetchTodayMeals = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/meal-log/today', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMeals(response.data);
    } catch (error) {
      console.error('Error fetching today\'s meals:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch available meals
  const fetchAvailableMeals = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/meals', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAvailableMeals(response.data);
    } catch (error) {
      console.error('Error fetching available meals:', error);
    }
  };

  // Add meal log
  const handleAddMeal = async (e) => {
    e.preventDefault();
    
    if (!selectedMeal || !caloriesConsumed) {
      alert('Please select a meal and enter calories');
      return;
    }

    try {
      setAddingMeal(true);
      const token = localStorage.getItem('token');
      const mealLog = {
        mealId: selectedMeal,
        caloriesConsumed: parseInt(caloriesConsumed),
        consumedAt: new Date().toISOString()
      };

      const response = await axios.post('/api/meal-log', mealLog, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMeals(prev => [response.data, ...prev]);
      setSelectedMeal('');
      setCaloriesConsumed('');
      alert('Meal added successfully!');
    } catch (error) {
      console.error('Error adding meal:', error);
      alert('Failed to add meal');
    } finally {
      setAddingMeal(false);
    }
  };

  // Delete meal log
  const handleDeleteMeal = async (mealLogId) => {
    if (!window.confirm('Are you sure you want to delete this meal log?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/meal-log/${mealLogId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMeals(prev => prev.filter(meal => meal.id !== mealLogId));
      alert('Meal deleted successfully!');
    } catch (error) {
      console.error('Error deleting meal:', error);
      alert('Failed to delete meal');
    }
  };

  // Filter meals by type
  const filteredMeals = meals.filter(meal => {
    if (filter === 'all') return true;
    return meal.meal?.mealType === filter;
  });

  // Calculate total calories
  const totalCalories = filteredMeals.reduce((sum, meal) => sum + meal.caloriesConsumed, 0);

  useEffect(() => {
    fetchTodayMeals();
    fetchAvailableMeals();
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

  return (
    <div className="container-fluid bg-light py-4" style={{ minHeight: "100vh" }}>
      <div className="container">
        {/* HEADER */}
        <div className="row mb-4">
          <div className="col-12">
            <h2 className="fw-bold">Meal Tracker</h2>
            <p className="text-muted">Log your daily meals and track calories</p>
          </div>
        </div>

        <div className="row">
          {/* ADD MEAL FORM */}
          <div className="col-md-4 mb-4">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Add Meal</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleAddMeal}>
                  <div className="mb-3">
                    <label className="form-label">Select Meal</label>
                    <select 
                      className="form-select"
                      value={selectedMeal}
                      onChange={(e) => setSelectedMeal(e.target.value)}
                      required
                    >
                      <option value="">Choose a meal...</option>
                      {availableMeals.map((meal) => (
                        <option key={meal.id} value={meal.id}>
                          {meal.name} ({meal.calories} cal)
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Calories Consumed</label>
                    <input 
                      type="number" 
                      className="form-control"
                      value={caloriesConsumed}
                      onChange={(e) => setCaloriesConsumed(e.target.value)}
                      placeholder="Enter calories"
                      min="1"
                      required
                    />
                  </div>

                  {selectedMeal && (
                    <div className="mb-3">
                      <small className="text-muted">
                        {availableMeals.find(m => m.id === selectedMeal)?.description}
                      </small>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="btn btn-primary w-100"
                    disabled={addingMeal}
                  >
                    {addingMeal ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Adding...
                      </>
                    ) : (
                      'Add Meal'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* MEALS LIST */}
          <div className="col-md-8 mb-4">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Today's Meals</h5>
                <div>
                  <span className="badge bg-primary me-2">
                    Total: {totalCalories} cal
                  </span>
                  <select 
                    className="form-select form-select-sm"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    style={{ width: 'auto' }}
                  >
                    <option value="all">All Meals</option>
                    <option value="BREAKFAST">Breakfast</option>
                    <option value="LUNCH">Lunch</option>
                    <option value="DINNER">Dinner</option>
                    <option value="SNACK">Snack</option>
                  </select>
                </div>
              </div>
              <div className="card-body">
                {filteredMeals.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted">No meals logged today</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Time</th>
                          <th>Meal</th>
                          <th>Type</th>
                          <th>Calories</th>
                          <th>Protein</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMeals.map((mealLog) => (
                          <tr key={mealLog.id}>
                            <td>
                              {new Date(mealLog.consumedAt).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </td>
                            <td>{mealLog.meal?.name || 'Unknown'}</td>
                            <td>
                              <span className={`badge ${
                                mealLog.meal?.mealType === 'BREAKFAST' ? 'bg-warning' :
                                mealLog.meal?.mealType === 'LUNCH' ? 'bg-info' :
                                mealLog.meal?.mealType === 'DINNER' ? 'bg-success' : 'bg-secondary'
                              }`}>
                                {mealLog.meal?.mealType || 'Unknown'}
                              </span>
                            </td>
                            <td>
                              <strong>{mealLog.caloriesConsumed}</strong> cal
                            </td>
                            <td>{mealLog.meal?.protein || 0}g</td>
                            <td>
                              <button 
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteMeal(mealLog.id)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealTrackerPage;
