import React from 'react';

const WeeklyProgress = ({ weeklyData, loading }) => {
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!weeklyData || weeklyData.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-calendar-week fs-1 text-muted mb-3"></i>
        <h4>No Weekly Data</h4>
        <p className="text-muted">
          Start logging your meals to see your weekly progress.
        </p>
      </div>
    );
  }

  // Sort data by date
  const sortedData = [...weeklyData].sort((a, b) => new Date(a.summaryDate) - new Date(b.summaryDate));

  // Calculate weekly totals
  const weeklyTotals = sortedData.reduce((totals, day) => {
    totals.calories += day.totalCalories || 0;
    totals.protein += day.totalProtein || 0;
    totals.carbs += day.totalCarbs || 0;
    totals.fat += day.totalFat || 0;
    totals.meals += (day.breakfastCount || 0) + (day.lunchCount || 0) + (day.dinnerCount || 0) + (day.snackCount || 0);
    if (day.goalAchieved) totals.goalsAchieved++;
    return totals;
  }, { calories: 0, protein: 0, carbs: 0, fat: 0, meals: 0, goalsAchieved: 0 });

  const averageCalories = Math.round(weeklyTotals.calories / sortedData.length);
  const averageProtein = (weeklyTotals.protein / sortedData.length).toFixed(1);
  const averageCarbs = (weeklyTotals.carbs / sortedData.length).toFixed(1);
  const averageFat = (weeklyTotals.fat / sortedData.length).toFixed(1);

  const getDayName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const getCalorieStatus = (summary) => {
    if (!summary.dailyCalorieTarget) return 'neutral';
    
    const variance = Math.abs(summary.totalCalories - summary.dailyCalorieTarget);
    const allowedVariance = summary.dailyCalorieTarget * 0.1; // 10% variance
    
    if (variance <= allowedVariance) return 'on-track';
    if (summary.totalCalories > summary.dailyCalorieTarget) return 'over';
    return 'under';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'on-track': return 'success';
      case 'over': return 'danger';
      case 'under': return 'warning';
      default: return 'secondary';
    }
  };

  const getCalorieProgress = (summary) => {
    if (!summary.dailyCalorieTarget) return 0;
    return Math.min((summary.totalCalories / summary.dailyCalorieTarget) * 100, 100);
  };

  return (
    <div className="row">
      <div className="col-lg-8">
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white">
            <h5 className="card-title mb-0">
              <i className="bi bi-calendar-week me-2"></i>
              Weekly Progress
            </h5>
            <p className="text-muted small mb-0">
              Last 7 days of meal tracking
            </p>
          </div>
          <div className="card-body">
            {/* Weekly Summary Cards */}
            <div className="row mb-4">
              <div className="col-md-3">
                <div className="text-center">
                  <div className="text-primary mb-2">
                    <i className="bi bi-fire fs-1"></i>
                  </div>
                  <h6 className="text-muted">Avg Calories</h6>
                  <h4 className="fw-bold">{averageCalories}</h4>
                  <small className="text-muted">per day</small>
                </div>
              </div>
              <div className="col-md-3">
                <div className="text-center">
                  <div className="text-success mb-2">
                    <i className="bi bi-egg-fried fs-1"></i>
                  </div>
                  <h6 className="text-muted">Avg Protein</h6>
                  <h4 className="fw-bold">{averageProtein}g</h4>
                  <small className="text-muted">per day</small>
                </div>
              </div>
              <div className="col-md-3">
                <div className="text-center">
                  <div className="text-warning mb-2">
                    <i className="bi bi-bread-slice fs-1"></i>
                  </div>
                  <h6 className="text-muted">Avg Carbs</h6>
                  <h4 className="fw-bold">{averageCarbs}g</h4>
                  <small className="text-muted">per day</small>
                </div>
              </div>
              <div className="col-md-3">
                <div className="text-center">
                  <div className="text-info mb-2">
                    <i className="bi bi-droplet fs-1"></i>
                  </div>
                  <h6 className="text-muted">Avg Fat</h6>
                  <h4 className="fw-bold">{averageFat}g</h4>
                  <small className="text-muted">per day</small>
                </div>
              </div>
            </div>

            {/* Daily Breakdown */}
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Calories</th>
                    <th>Target</th>
                    <th>Progress</th>
                    <th>Status</th>
                    <th>Meals</th>
                    <th>Goal</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map((day, index) => {
                    const status = getCalorieStatus(day);
                    const progress = getCalorieProgress(day);
                    
                    return (
                      <tr key={index}>
                        <td className="fw-semibold">{getDayName(day.summaryDate)}</td>
                        <td>
                          <span className={`badge bg-${status === 'on-track' ? 'success' : status === 'over' ? 'danger' : 'warning'}`}>
                            {day.totalCalories || 0}
                          </span>
                        </td>
                        <td>{day.dailyCalorieTarget || 'N/A'}</td>
                        <td>
                          <div className="progress" style={{ height: '8px', width: '100px' }}>
                            <div
                              className={`progress-bar bg-${getStatusColor(status)}`}
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </td>
                        <td>
                          <span className={`badge bg-${getStatusColor(status)}`}>
                            {status.replace('-', ' ')}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            {(day.breakfastCount || 0) > 0 && (
                              <span className="badge bg-warning" title="Breakfast">B</span>
                            )}
                            {(day.lunchCount || 0) > 0 && (
                              <span className="badge bg-success" title="Lunch">L</span>
                            )}
                            {(day.dinnerCount || 0) > 0 && (
                              <span className="badge bg-primary" title="Dinner">D</span>
                            )}
                            {(day.snackCount || 0) > 0 && (
                              <span className="badge bg-info" title="Snacks">S</span>
                            )}
                          </div>
                        </td>
                        <td>
                          {day.goalAchieved ? (
                            <i className="bi bi-check-circle-fill text-success"></i>
                          ) : (
                            <i className="bi bi-x-circle text-muted"></i>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-4">
        <div className="card border-0 shadow-sm mb-3">
          <div className="card-header bg-white">
            <h6 className="card-title mb-0">
              <i className="bi bi-trophy me-2"></i>
              Weekly Stats
            </h6>
          </div>
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span>Goals Achieved</span>
              <span className="badge bg-success">
                {weeklyTotals.goalsAchieved}/{sortedData.length} days
              </span>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span>Total Meals</span>
              <span className="badge bg-info">{weeklyTotals.meals}</span>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span>Avg Meals/Day</span>
              <span className="badge bg-secondary">
                {(weeklyTotals.meals / sortedData.length).toFixed(1)}
              </span>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <span>Success Rate</span>
              <span className="badge bg-primary">
                {Math.round((weeklyTotals.goalsAchieved / sortedData.length) * 100)}%
              </span>
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-sm mb-3">
          <div className="card-header bg-white">
            <h6 className="card-title mb-0">
              <i className="bi bi-graph-up me-2"></i>
              Performance Analysis
            </h6>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <h6 className="fw-semibold mb-2">Calorie Consistency</h6>
              <div className="progress" style={{ height: '10px' }}>
                <div 
                  className="progress-bar bg-success" 
                  style={{ width: `${Math.round((weeklyTotals.goalsAchieved / sortedData.length) * 100)}%` }}
                ></div>
              </div>
              <small className="text-muted">
                {Math.round((weeklyTotals.goalsAchieved / sortedData.length) * 100)}% on target
              </small>
            </div>

            <div className="mb-3">
              <h6 className="fw-semibold mb-2">Meal Frequency</h6>
              <div className="progress" style={{ height: '10px' }}>
                <div 
                  className="progress-bar bg-info" 
                  style={{ width: `${Math.min((weeklyTotals.meals / (sortedData.length * 4)) * 100, 100)}%` }}
                ></div>
              </div>
              <small className="text-muted">
                {((weeklyTotals.meals / (sortedData.length * 4)) * 100).toFixed(0)}% meal coverage
              </small>
            </div>

            <div className="alert alert-light small" role="alert">
              <i className="bi bi-lightbulb me-2"></i>
              {weeklyTotals.goalsAchieved >= 5 ? 
                "Great consistency! Keep up the good work." :
                "Try to be more consistent with your meal logging for better results."
              }
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white">
            <h6 className="card-title mb-0">
              <i className="bi bi-calendar-check me-2"></i>
              Recommendations
            </h6>
          </div>
          <div className="card-body">
            <ul className="small mb-0">
              <li className="mb-2">
                <i className="bi bi-check-circle text-success me-2"></i>
                Log meals consistently for accurate tracking
              </li>
              <li className="mb-2">
                <i className="bi bi-check-circle text-success me-2"></i>
                Aim for balanced macro distribution
              </li>
              <li className="mb-2">
                <i className="bi bi-check-circle text-success me-2"></i>
                Stay within 10% of daily calorie targets
              </li>
              <li>
                <i className="bi bi-check-circle text-success me-2"></i>
                Review weekly trends to adjust habits
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyProgress;
