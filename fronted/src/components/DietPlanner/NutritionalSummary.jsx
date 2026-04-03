import React from 'react';

const NutritionalSummary = ({ dietPlan, calculation }) => {
  if (!dietPlan) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-pie-chart fs-1 text-muted mb-3"></i>
        <h4>No Nutritional Data</h4>
        <p className="text-muted">
          Generate a diet plan to see detailed nutritional information.
        </p>
      </div>
    );
  }

  // Mock data for demonstration
  const weeklyNutrition = {
    totalCalories: dietPlan.dailyCalorieTarget * 7,
    totalProtein: (dietPlan.totalProteinGrams || 0) * 7,
    totalCarbs: (dietPlan.totalCarbsGrams || 0) * 7,
    totalFat: (dietPlan.totalFatGrams || 0) * 7,
    mealsPerWeek: 28, // 4 meals per day × 7 days
    prepTimePerWeek: 175 // 25 minutes average per meal
  };

  const macroDistribution = [
    { name: 'Protein', value: dietPlan.totalProteinGrams || 0, calories: (dietPlan.totalProteinGrams || 0) * 4, color: '#28a745' },
    { name: 'Carbs', value: dietPlan.totalCarbsGrams || 0, calories: (dietPlan.totalCarbsGrams || 0) * 4, color: '#ffc107' },
    { name: 'Fat', value: dietPlan.totalFatGrams || 0, calories: (dietPlan.totalFatGrams || 0) * 9, color: '#17a2b8' }
  ];

  const getMacroPercentage = (calories) => {
    return ((calories / dietPlan.dailyCalorieTarget) * 100).toFixed(1);
  };

  const getGoalColor = (goal) => {
    switch (goal) {
      case 'WEIGHT_LOSS':
        return 'warning';
      case 'WEIGHT_GAIN':
        return 'success';
      case 'MAINTENANCE':
        return 'info';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="row">
      <div className="col-lg-8">
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white">
            <h5 className="card-title mb-0">
              <i className="bi bi-pie-chart me-2"></i>
              Nutritional Summary
            </h5>
            <p className="text-muted small mb-0">
              Daily and weekly nutritional breakdown
            </p>
          </div>
          <div className="card-body">
            <div className="row mb-4">
              <div className="col-md-6">
                <h6 className="fw-semibold mb-3">Daily Targets</h6>
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span>Total Calories</span>
                    <span className="badge bg-primary fs-6">{dietPlan.dailyCalorieTarget} cal</span>
                  </div>
                  <div className="progress" style={{ height: '10px' }}>
                    <div className="progress-bar bg-primary" style={{ width: '100%' }}></div>
                  </div>
                </div>
                
                {macroDistribution.map((macro) => (
                  <div className="mb-3" key={macro.name}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span>{macro.name}</span>
                      <span className="badge" style={{ backgroundColor: macro.color }}>
                        {macro.value.toFixed(1)}g ({getMacroPercentage(macro.calories)}%)
                      </span>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div 
                        className="progress-bar" 
                        style={{ 
                          width: `${getMacroPercentage(macro.calories)}%`,
                          backgroundColor: macro.color 
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="col-md-6">
                <h6 className="fw-semibold mb-3">Weekly Overview</h6>
                <div className="row">
                  <div className="col-6 mb-3">
                    <div className="text-center">
                      <div className="text-primary mb-2">
                        <i className="bi bi-fire fs-2"></i>
                      </div>
                      <h6 className="text-muted">Calories</h6>
                      <h5 className="fw-bold">{weeklyNutrition.totalCalories.toLocaleString()}</h5>
                      <small className="text-muted">per week</small>
                    </div>
                  </div>
                  <div className="col-6 mb-3">
                    <div className="text-center">
                      <div className="text-success mb-2">
                        <i className="bi bi-egg-fried fs-2"></i>
                      </div>
                      <h6 className="text-muted">Protein</h6>
                      <h5 className="fw-bold">{weeklyNutrition.totalProtein.toFixed(0)}g</h5>
                      <small className="text-muted">per week</small>
                    </div>
                  </div>
                  <div className="col-6 mb-3">
                    <div className="text-center">
                      <div className="text-warning mb-2">
                        <i className="bi bi-bread-slice fs-2"></i>
                      </div>
                      <h6 className="text-muted">Carbs</h6>
                      <h5 className="fw-bold">{weeklyNutrition.totalCarbs.toFixed(0)}g</h5>
                      <small className="text-muted">per week</small>
                    </div>
                  </div>
                  <div className="col-6 mb-3">
                    <div className="text-center">
                      <div className="text-info mb-2">
                        <i className="bi bi-droplet fs-2"></i>
                      </div>
                      <h6 className="text-muted">Fat</h6>
                      <h5 className="fw-bold">{weeklyNutrition.totalFat.toFixed(0)}g</h5>
                      <small className="text-muted">per week</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <h6 className="fw-semibold mb-3">Macro Distribution</h6>
                <div className="d-flex justify-content-center mb-3">
                  <div style={{ position: 'relative', width: '200px', height: '200px' }}>
                    {/* Simple pie chart visualization */}
                    <svg width="200" height="200" viewBox="0 0 200 200">
                      {macroDistribution.map((macro, index) => {
                        const percentage = getMacroPercentage(macro.calories);
                        const startAngle = index === 0 ? 0 : 
                          macroDistribution.slice(0, index).reduce((sum, m) => sum + parseFloat(getMacroPercentage(m.calories)), 0);
                        const endAngle = startAngle + parseFloat(percentage);
                        
                        const x1 = 100 + 80 * Math.cos((startAngle - 90) * Math.PI / 180);
                        const y1 = 100 + 80 * Math.sin((startAngle - 90) * Math.PI / 180);
                        const x2 = 100 + 80 * Math.cos((endAngle - 90) * Math.PI / 180);
                        const y2 = 100 + 80 * Math.sin((endAngle - 90) * Math.PI / 180);
                        
                        const largeArcFlag = percentage > 50 ? 1 : 0;
                        
                        return (
                          <path
                            key={macro.name}
                            d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                            fill={macro.color}
                            stroke="white"
                            strokeWidth="2"
                          />
                        );
                      })}
                    </svg>
                  </div>
                </div>
                <div className="d-flex justify-content-center gap-3">
                  {macroDistribution.map((macro) => (
                    <div key={macro.name} className="text-center">
                      <div 
                        className="rounded-circle mb-1" 
                        style={{ 
                          width: '12px', 
                          height: '12px', 
                          backgroundColor: macro.color 
                        }}
                      ></div>
                      <small>{macro.name}</small>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-md-6">
                <h6 className="fw-semibold mb-3">Plan Statistics</h6>
                <div className="list-group list-group-flush">
                  <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                    <span><i className="bi bi-calendar-week me-2"></i>Meals per Week</span>
                    <span className="badge bg-primary">{weeklyNutrition.mealsPerWeek}</span>
                  </div>
                  <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                    <span><i className="bi bi-clock me-2"></i>Prep Time per Week</span>
                    <span className="badge bg-info">{weeklyNutrition.prepTimePerWeek} min</span>
                  </div>
                  <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                    <span><i className="bi bi-bullseye me-2"></i>Fitness Goal</span>
                    <span className={`badge bg-${getGoalColor(dietPlan.fitnessGoal)}`}>
                      {dietPlan.fitnessGoal?.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                    <span><i className="bi bi-calendar-check me-2"></i>Plan Created</span>
                    <span className="badge bg-secondary">
                      {new Date(dietPlan.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white">
            <h6 className="card-title mb-0">
              <i className="bi bi-graph-up me-2"></i>
              Expected Results
            </h6>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <h6 className="fw-semibold mb-3">Weight Change Projection</h6>
                <div className="alert alert-info" role="alert">
                  <i className="bi bi-info-circle me-2"></i>
                  <strong>Expected Weekly Change:</strong>
                  {dietPlan.fitnessGoal === 'WEIGHT_LOSS' && (
                    <span className="text-warning"> -0.5 kg (1 lb) per week</span>
                  )}
                  {dietPlan.fitnessGoal === 'WEIGHT_GAIN' && (
                    <span className="text-success"> +0.5 kg (1 lb) per week</span>
                  )}
                  {dietPlan.fitnessGoal === 'MAINTENANCE' && (
                    <span className="text-info"> Maintain current weight</span>
                  )}
                </div>
                <div className="alert alert-success" role="alert">
                  <i className="bi bi-check-circle me-2"></i>
                  <strong>Monthly Projection:</strong>
                  {dietPlan.fitnessGoal === 'WEIGHT_LOSS' && (
                    <span className="text-warning"> -2 kg (4.4 lbs) per month</span>
                  )}
                  {dietPlan.fitnessGoal === 'WEIGHT_GAIN' && (
                    <span className="text-success"> +2 kg (4.4 lbs) per month</span>
                  )}
                  {dietPlan.fitnessGoal === 'MAINTENANCE' && (
                    <span className="text-info"> Stable weight</span>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="fw-semibold mb-3">Health Benefits</h6>
                <ul className="small">
                  <li className="mb-2">
                    <i className="bi bi-check-circle text-success me-2"></i>
                    Balanced macronutrient distribution
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle text-success me-2"></i>
                    Adequate protein for muscle maintenance
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle text-success me-2"></i>
                    Sufficient energy for daily activities
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check-circle text-success me-2"></i>
                    Supports your {dietPlan.fitnessGoal?.replace('_', ' ').toLowerCase()} goals
                  </li>
                  <li>
                    <i className="bi bi-check-circle text-success me-2"></i>
                    Promotes healthy eating habits
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-4">
        <div className="card border-0 shadow-sm mb-3">
          <div className="card-header bg-white">
            <h6 className="card-title mb-0">
              <i className="bi bi-lightning me-2"></i>
              Energy Balance
            </h6>
          </div>
          <div className="card-body">
            {calculation && (
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="small">BMR</span>
                  <span className="badge bg-secondary">{Math.round(calculation.bmr)} cal</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="small">TDEE</span>
                  <span className="badge bg-info">{Math.round(calculation.tdee)} cal</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="small">Target</span>
                  <span className="badge bg-primary">{dietPlan.dailyCalorieTarget} cal</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between align-items-center">
                  <span className="small fw-semibold">Daily Difference</span>
                  <span className={`badge bg-${dietPlan.fitnessGoal === 'WEIGHT_LOSS' ? 'warning' : dietPlan.fitnessGoal === 'WEIGHT_GAIN' ? 'success' : 'info'}`}>
                    {dietPlan.dailyCalorieTarget - Math.round(calculation.tdee)} cal
                  </span>
                </div>
              </div>
            )}
            
            <div className="alert alert-light small" role="alert">
              <i className="bi bi-info-circle me-2"></i>
              {dietPlan.fitnessGoal === 'WEIGHT_LOSS' && 
                'Calorie deficit promotes fat loss while preserving muscle mass.'}
              {dietPlan.fitnessGoal === 'WEIGHT_GAIN' && 
                'Calorie surplus supports healthy weight gain and muscle building.'}
              {dietPlan.fitnessGoal === 'MAINTENANCE' && 
                'Balanced intake maintains current weight and body composition.'}
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white">
            <h6 className="card-title mb-0">
              <i className="bi bi-trophy me-2"></i>
              Achievement Milestones
            </h6>
          </div>
          <div className="card-body">
            <div className="timeline">
              <div className="timeline-item mb-3">
                <div className="timeline-marker bg-success"></div>
                <div className="timeline-content">
                  <h6 className="mb-1">Week 1</h6>
                  <p className="small text-muted mb-0">Adapt to new eating routine</p>
                </div>
              </div>
              <div className="timeline-item mb-3">
                <div className="timeline-marker bg-primary"></div>
                <div className="timeline-content">
                  <h6 className="mb-1">Week 4</h6>
                  <p className="small text-muted mb-0">First noticeable results</p>
                </div>
              </div>
              <div className="timeline-item mb-3">
                <div className="timeline-marker bg-info"></div>
                <div className="timeline-content">
                  <h6 className="mb-1">Week 8</h6>
                  <p className="small text-muted mb-0">Significant progress visible</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-marker bg-warning"></div>
                <div className="timeline-content">
                  <h6 className="mb-1">Week 12</h6>
                  <p className="small text-muted mb-0">Goal achievement milestone</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionalSummary;
