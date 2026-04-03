import React from 'react';

const DailySummary = ({ summary, statistics, onAddMeal }) => {
  const getCalorieProgress = () => {
    if (!summary || !summary.dailyCalorieTarget) return 0;
    return Math.min((summary.totalCalories / summary.dailyCalorieTarget) * 100, 100);
  };

  const getCalorieStatus = () => {
    if (!summary || !summary.dailyCalorieTarget) return 'neutral';
    
    const remaining = summary.caloriesRemaining;
    if (remaining > 200) return 'low';
    if (remaining < -200) return 'over';
    return 'on-track';
  };

  const getStatusColor = () => {
    const status = getCalorieStatus();
    switch (status) {
      case 'low': return 'warning';
      case 'over': return 'danger';
      case 'on-track': return 'success';
      default: return 'secondary';
    }
  };

  const getStatusMessage = () => {
    const status = getCalorieStatus();
    switch (status) {
      case 'low':
        return `${summary?.caloriesRemaining || 0} calories remaining`;
      case 'over':
        return `${Math.abs(summary?.caloriesRemaining || 0)} calories over target`;
      case 'on-track':
        return 'Perfect! On track with your calorie goal';
      default:
        return 'Start tracking your meals';
    }
  };

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

  if (!summary) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body text-center py-5">
          <i className="bi bi-calendar-day fs-1 text-muted mb-3"></i>
          <h4>No Data Yet</h4>
          <p className="text-muted mb-4">
            Start logging your meals to see your daily nutrition summary.
          </p>
          <button className="btn btn-success" onClick={onAddMeal}>
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
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="card-title mb-0">
              <i className="bi bi-calendar-check me-2"></i>
              Daily Summary
            </h5>
            <p className="text-muted small mb-0">
              {new Date(summary.summaryDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <button
            className="btn btn-outline-success btn-sm"
            onClick={onAddMeal}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Add Meal
          </button>
        </div>
      </div>
      <div className="card-body">
        {/* Calorie Progress */}
        <div className="row mb-4">
          <div className="col-md-8">
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0">Daily Calories</h6>
                <span className={`badge bg-${getStatusColor()} fs-6`}>
                  {summary.totalCalories || 0} / {summary.dailyCalorieTarget || 'N/A'}
                </span>
              </div>
              <div className="progress" style={{ height: '16px' }}>
                <div
                  className={`progress-bar bg-${getStatusColor()}`}
                  style={{ width: `${getCalorieProgress()}%` }}
                ></div>
              </div>
              <small className="text-muted mt-1 d-block">{getStatusMessage()}</small>
            </div>
          </div>
          <div className="col-md-4">
            <div className="text-center">
              {summary.goalAchieved ? (
                <div className="text-success">
                  <i className="bi bi-trophy-fill fs-1"></i>
                  <h6 className="mt-2 mb-0">Goal Achieved!</h6>
                </div>
              ) : (
                <div className="text-info">
                  <i className="bi bi-bullseye fs-1"></i>
                  <h6 className="mt-2 mb-0">In Progress</h6>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Macro Summary */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="text-center">
              <div className="text-success mb-2">
                <i className="bi bi-egg-fried fs-2"></i>
              </div>
              <h6 className="text-muted">Protein</h6>
              <h4 className="fw-bold">{(summary.totalProtein || 0).toFixed(1)}g</h4>
              {summary.proteinTarget && (
                <small className="text-muted">
                  Target: {summary.proteinTarget.toFixed(1)}g
                </small>
              )}
            </div>
          </div>
          <div className="col-md-3">
            <div className="text-center">
              <div className="text-warning mb-2">
                <i className="bi bi-bread-slice fs-2"></i>
              </div>
              <h6 className="text-muted">Carbs</h6>
              <h4 className="fw-bold">{(summary.totalCarbs || 0).toFixed(1)}g</h4>
              {summary.carbsTarget && (
                <small className="text-muted">
                  Target: {summary.carbsTarget.toFixed(1)}g
                </small>
              )}
            </div>
          </div>
          <div className="col-md-3">
            <div className="text-center">
              <div className="text-info mb-2">
                <i className="bi bi-droplet fs-2"></i>
              </div>
              <h6 className="text-muted">Fat</h6>
              <h4 className="fw-bold">{(summary.totalFat || 0).toFixed(1)}g</h4>
              {summary.fatTarget && (
                <small className="text-muted">
                  Target: {summary.fatTarget.toFixed(1)}g
                </small>
              )}
            </div>
          </div>
          <div className="col-md-3">
            <div className="text-center">
              <div className="text-secondary mb-2">
                <i className="bi bi-flower1 fs-2"></i>
              </div>
              <h6 className="text-muted">Fiber</h6>
              <h4 className="fw-bold">{(summary.totalFiber || 0).toFixed(1)}g</h4>
              <small className="text-muted">Daily intake</small>
            </div>
          </div>
        </div>

        {/* Meal Breakdown */}
        <div className="row">
          <div className="col-md-6">
            <h6 className="fw-semibold mb-3">Meal Breakdown</h6>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span>
                <i className="bi bi-sunrise text-warning me-2"></i>
                Breakfast
              </span>
              <span className="badge bg-warning">{summary.breakfastCount || 0}</span>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span>
                <i className="bi bi-sun text-success me-2"></i>
                Lunch
              </span>
              <span className="badge bg-success">{summary.lunchCount || 0}</span>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span>
                <i className="bi bi-moon text-primary me-2"></i>
                Dinner
              </span>
              <span className="badge bg-primary">{summary.dinnerCount || 0}</span>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <span>
                <i className="bi bi-cup-straw text-info me-2"></i>
                Snacks
              </span>
              <span className="badge bg-info">{summary.snackCount || 0}</span>
            </div>
          </div>

          <div className="col-md-6">
            <h6 className="fw-semibold mb-3">Quick Stats</h6>
            {statistics && (
              <div className="list-group list-group-flush">
                <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span>Current Streak</span>
                  <span className="badge bg-primary">{statistics.currentStreak} days</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span>Today's Meals</span>
                  <span className="badge bg-secondary">{statistics.todayMeals}</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <span>Week Average</span>
                  <span className="badge bg-info">{statistics.weekAverageCalories} cal</span>
                </div>
              </div>
            )}
            
            {summary.waterIntakeMl && (
              <div className="mt-3">
                <div className="d-flex justify-content-between align-items-center">
                  <span>
                    <i className="bi bi-droplet text-info me-2"></i>
                    Water Intake
                  </span>
                  <span className="badge bg-info">{summary.waterIntakeMl}ml</span>
                </div>
                <div className="progress mt-2" style={{ height: '6px' }}>
                  <div 
                    className="progress-bar bg-info" 
                    style={{ width: `${Math.min((summary.waterIntakeMl / 2000) * 100, 100)}%` }}
                  ></div>
                </div>
                <small className="text-muted">Goal: 2000ml</small>
              </div>
            )}
          </div>
        </div>

        {/* Goal Achievement Message */}
        {summary.goalAchieved && (
          <div className="alert alert-success mt-3" role="alert">
            <i className="bi bi-check-circle me-2"></i>
            <strong>Great job!</strong> You've successfully met your daily nutrition goals today.
          </div>
        )}
      </div>
    </div>
  );
};

export default DailySummary;
