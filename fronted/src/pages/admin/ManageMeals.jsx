import React, { useState, useEffect } from 'react';
import { authService } from '../../services/apiService';
import 'bootstrap/dist/css/bootstrap.min.css';

const ManageMeals = () => {
  const [meals, setMeals] = useState([]);
  const [dietPlans, setDietPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMeals();
  }, [searchTerm]);

  useEffect(() => {
    fetchDietPlans();
  }, []);

  const fetchMeals = async () => {
    try {
      setLoading(true);
      setError('');
      let response;
      if (searchTerm) {
        response = await authService.searchAdminMeals(searchTerm);
      } else {
        response = await authService.getAdminMeals();
      }
      setMeals(Array.isArray(response.data) ? response.data : response.data.meals || []);
    } catch (error) {
      console.error('Error fetching meals:', error);
      const status = error.response?.status;
      const serverMessage = error.response?.data?.message || error.response?.data?.error;
      if (status === 401) {
        setError('Failed to load meals: unauthorized. Please log in again.');
      } else if (status === 403) {
        setError('Failed to load meals: admin access is required.');
      } else {
        setError(`Failed to load meals${serverMessage ? `: ${serverMessage}` : ''}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchDietPlans = async () => {
    try {
      const response = await authService.getAdminDietPlans();
      setDietPlans(Array.isArray(response.data) ? response.data : response.data.dietPlans || []);
    } catch (error) {
      console.error('Error fetching diet plans:', error);
      const status = error.response?.status;
      const serverMessage = error.response?.data?.message || error.response?.data?.error;
      if (status === 401) {
        setError('Failed to load diet plans: unauthorized. Please log in again.');
      } else if (status === 403) {
        setError('Failed to load diet plans: admin access is required.');
      } else if (serverMessage) {
        setError(`Failed to load diet plans: ${serverMessage}`);
      }
    }
  };

  const handleAddMeal = () => {
    setSelectedMeal(null);
    setShowAddModal(true);
  };

  const handleEditMeal = (meal) => {
    setSelectedMeal(meal);
    setShowEditModal(true);
  };

  const handleDeleteMeal = async (mealId) => {
    if (window.confirm('Are you sure you want to delete this meal?')) {
      try {
        await authService.deleteAdminMeal(mealId);
        fetchMeals();
      } catch (error) {
        console.error('Error deleting meal:', error);
        setError('Failed to delete meal');
      }
    }
  };

  const handleSaveMeal = async (mealData) => {
    try {
      const payload = {
        name: mealData.name.trim(),
        description: mealData.description || '',
        mealType: mealData.mealType,
        calories: Number(mealData.calories),
        protein: Number(mealData.protein),
        carbs: Number(mealData.carbs),
        fat: Number(mealData.fat),
        dietPlanId: mealData.dietPlanId
      };

      if (selectedMeal) {
        await authService.updateAdminMeal(selectedMeal.id, payload);
      } else {
        await authService.createAdminMeal(payload);
      }
      setShowAddModal(false);
      setShowEditModal(false);
      setSelectedMeal(null);
      fetchMeals();
    } catch (error) {
      console.error('Error saving meal:', error);
      setError('Failed to save meal');
    }
  };

  if (loading && meals.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
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
              <h1 className="h3 mb-1">Manage Meals</h1>
              <p className="text-muted mb-0">Create and manage meal options for diet plans</p>
            </div>
            <button 
              className="btn btn-success"
              onClick={handleAddMeal}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Add New Meal
            </button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="row mb-4">
        <div className="col-md-8">
          <input
            type="text"
            className="form-control"
            placeholder="Search meals by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <button className="btn btn-outline-secondary w-100" onClick={fetchMeals}>
            <i className="bi bi-arrow-clockwise me-2"></i>
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="alert alert-danger" role="alert">
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

      {/* Meals Table */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Calories</th>
                      <th>Protein</th>
                      <th>Carbs</th>
                      <th>Fat</th>
                      <th>Prep Time</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {meals.map((meal) => (
                      <tr key={meal.id}>
                        <td>
                          <div>
                            <strong>{meal.name}</strong>
                            {meal.description && (
                              <small className="text-muted d-block">{meal.description}</small>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className={`badge bg-${
                            meal.mealType === 'BREAKFAST' ? 'primary' :
                            meal.mealType === 'LUNCH' ? 'success' :
                            meal.mealType === 'DINNER' ? 'warning' : 'info'
                          }`}>
                            {meal.mealType}
                          </span>
                        </td>
                        <td>{meal.calories}</td>
                        <td>{meal.protein}g</td>
                        <td>{meal.carbs}g</td>
                        <td>{meal.fat}g</td>
                        <td>{meal.prepTimeMinutes || 15} min</td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button 
                              className="btn btn-outline-primary"
                              onClick={() => handleEditMeal(meal)}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button 
                              className="btn btn-outline-danger"
                              onClick={() => handleDeleteMeal(meal.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {meals.length === 0 && (
                      <tr>
                        <td colSpan="8" className="text-center text-muted py-4">
                          No meals found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Meal Modal */}
      {(showAddModal || showEditModal) && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {selectedMeal ? 'Edit Meal' : 'Add New Meal'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setSelectedMeal(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <MealForm 
                  meal={selectedMeal}
                  dietPlans={dietPlans}
                  onSave={handleSaveMeal}
                  onCancel={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setSelectedMeal(null);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Meal Form Component
const MealForm = ({ meal, dietPlans, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: meal?.name || '',
    description: meal?.description || '',
    mealType: meal?.mealType || 'BREAKFAST',
    calories: meal?.calories || '',
    protein: meal?.protein || '',
    carbs: meal?.carbs || '',
    fat: meal?.fat || '',
    dietPlanId: meal?.dietPlanId || ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Meal Name *</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Meal Type *</label>
          <select
            className="form-select"
            name="mealType"
            value={formData.mealType}
            onChange={handleChange}
            required
          >
            <option value="BREAKFAST">Breakfast</option>
            <option value="LUNCH">Lunch</option>
            <option value="DINNER">Dinner</option>
            <option value="SNACK">Snack</option>
          </select>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="2"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Diet Plan *</label>
        <select
          className="form-select"
          name="dietPlanId"
          value={formData.dietPlanId}
          onChange={handleChange}
          required
        >
          <option value="">Select a diet plan</option>
          {dietPlans.map((dietPlan) => (
            <option key={dietPlan.id} value={dietPlan.id}>
              {dietPlan.name}
            </option>
          ))}
        </select>
      </div>

      <h6 className="mt-4 mb-3">Nutritional Information</h6>
      <div className="row">
        <div className="col-md-3 mb-3">
          <label className="form-label">Calories *</label>
          <input
            type="number"
            className="form-control"
            name="calories"
            value={formData.calories}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-3 mb-3">
          <label className="form-label">Protein (g) *</label>
          <input
            type="number"
            step="0.1"
            className="form-control"
            name="protein"
            value={formData.protein}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-3 mb-3">
          <label className="form-label">Carbs (g) *</label>
          <input
            type="number"
            step="0.1"
            className="form-control"
            name="carbs"
            value={formData.carbs}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-3 mb-3">
          <label className="form-label">Fat (g) *</label>
          <input
            type="number"
            step="0.1"
            className="form-control"
            name="fat"
            value={formData.fat}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-success">
          {meal ? 'Update' : 'Create'} Meal
        </button>
      </div>
    </form>
  );
};

export default ManageMeals;
