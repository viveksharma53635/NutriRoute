import React, { useState } from 'react';
import MealLogItem from './MealLogItem';

const MealLogList = ({ meals, onDelete, onEdit, loading }) => {
  const [editingMeal, setEditingMeal] = useState(null);

  const handleEdit = (meal) => {
    setEditingMeal(meal);
  };

  const handleSave = (updatedMeal) => {
    onEdit(updatedMeal.id, updatedMeal);
    setEditingMeal(null);
  };

  const handleCancel = () => {
    setEditingMeal(null);
  };

  const handleDelete = (mealId) => {
    if (window.confirm('Are you sure you want to delete this meal?')) {
      onDelete(mealId);
    }
  };

  // Group meals by type
  const groupedMeals = meals.reduce((groups, meal) => {
    const type = meal.mealType || 'OTHER';
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(meal);
    return groups;
  }, {});

  const getMealIcon = (mealType) => {
    switch (mealType) {
      case 'BREAKFAST':
        return 'bi-sunrise';
      case 'LUNCH':
        return 'bi-sun';
      case 'DINNER':
        return 'bi-moon';
      case 'SNACK':
        return 'bi-cup-straw';
      default:
        return 'bi-circle';
    }
  };

  const getMealColor = (mealType) => {
    switch (mealType) {
      case 'BREAKFAST':
        return 'warning';
      case 'LUNCH':
        return 'success';
      case 'DINNER':
        return 'primary';
      case 'SNACK':
        return 'info';
      default:
        return 'secondary';
    }
  };

  const getMealTypeLabel = (mealType) => {
    switch (mealType) {
      case 'BREAKFAST':
        return 'Breakfast';
      case 'LUNCH':
        return 'Lunch';
      case 'DINNER':
        return 'Dinner';
      case 'SNACK':
        return 'Snacks';
      default:
        return 'Other';
    }
  };

  const calculateMealTotals = (mealList) => {
    return mealList.reduce((totals, meal) => {
      totals.calories += meal.calories || 0;
      totals.protein += meal.protein || 0;
      totals.carbs += meal.carbs || 0;
      totals.fat += meal.fat || 0;
      return totals;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  if (loading && meals.length === 0) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mt-3">Loading your meals...</p>
        </div>
      </div>
    );
  }

  if (meals.length === 0) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body text-center py-5">
          <i className="bi bi-egg-fried fs-1 text-muted mb-3"></i>
          <h4>No Meals Yet</h4>
          <p className="text-muted mb-4">
            Start logging your meals to track your daily nutrition.
          </p>
          <button className="btn btn-success" onClick={() => {}}>
            <i className="bi bi-plus-circle me-2"></i>
            Add Your First Meal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white">
        <h5 className="card-title mb-0">
          <i className="bi bi-list-ul me-2"></i>
          Today's Meals
        </h5>
        <p className="text-muted small mb-0">
          {meals.length} meal{meals.length !== 1 ? 's' : ''} logged today
        </p>
      </div>
      <div className="card-body">
        {Object.entries(groupedMeals).map(([mealType, mealList]) => {
          const totals = calculateMealTotals(mealList);
          const isEditingThisType = editingMeal && editingMeal.mealType === mealType;

          return (
            <div key={mealType} className="mb-4">
              {/* Meal Type Header */}
              <div className={`d-flex align-items-center mb-3 p-2 rounded bg-${getMealColor(mealType)} bg-opacity-10`}>
                <div className={`text-${getMealColor(mealType)} me-3`}>
                  <i className={`bi ${getMealIcon(mealType)} fs-4`}></i>
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-0 fw-semibold">{getMealTypeLabel(mealType)}</h6>
                  <small className="text-muted">
                    {mealList.length} item{mealList.length !== 1 ? 's' : ''} • 
                    {totals.calories} calories
                  </small>
                </div>
                <div className="d-flex gap-2 align-items-center">
                  <small className="text-muted">
                    <span className="text-success">{totals.protein.toFixed(1)}g</span> •
                    <span className="text-warning">{totals.carbs.toFixed(1)}g</span> •
                    <span className="text-info">{totals.fat.toFixed(1)}g</span>
                  </small>
                </div>
              </div>

              {/* Meal Items */}
              <div className="ms-4">
                {mealList.map((meal, index) => (
                  <MealLogItem
                    key={meal.id}
                    meal={meal}
                    isEditing={editingMeal?.id === meal.id}
                    onEdit={() => handleEdit(meal)}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    onDelete={() => handleDelete(meal.id)}
                    isLast={index === mealList.length - 1}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {/* Daily Summary */}
        <div className="border-top pt-3 mt-3">
          <div className="row text-center">
            <div className="col-md-3">
              <div className="text-primary mb-1">
                <i className="bi bi-fire fs-3"></i>
              </div>
              <h6 className="text-muted">Total Calories</h6>
              <h4 className="fw-bold">
                {meals.reduce((sum, meal) => sum + (meal.calories || 0), 0)}
              </h4>
            </div>
            <div className="col-md-3">
              <div className="text-success mb-1">
                <i className="bi bi-egg-fried fs-3"></i>
              </div>
              <h6 className="text-muted">Total Protein</h6>
              <h4 className="fw-bold">
                {meals.reduce((sum, meal) => sum + (meal.protein || 0), 0).toFixed(1)}g
              </h4>
            </div>
            <div className="col-md-3">
              <div className="text-warning mb-1">
                <i className="bi bi-bread-slice fs-3"></i>
              </div>
              <h6 className="text-muted">Total Carbs</h6>
              <h4 className="fw-bold">
                {meals.reduce((sum, meal) => sum + (meal.carbs || 0), 0).toFixed(1)}g
              </h4>
            </div>
            <div className="col-md-3">
              <div className="text-info mb-1">
                <i className="bi bi-droplet fs-3"></i>
              </div>
              <h6 className="text-muted">Total Fat</h6>
              <h4 className="fw-bold">
                {meals.reduce((sum, meal) => sum + (meal.fat || 0), 0).toFixed(1)}g
              </h4>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-3 text-center">
          <button className="btn btn-outline-success btn-sm me-2">
            <i className="bi bi-download me-2"></i>
            Export Data
          </button>
          <button className="btn btn-outline-secondary btn-sm">
            <i className="bi bi-share me-2"></i>
            Share Progress
          </button>
        </div>
      </div>
    </div>
  );
};

export default MealLogList;
