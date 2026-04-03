import React from 'react';

const CalorieCalculator = ({ profile, calculation, onCalculate, loading }) => {
  const getGoalIcon = (goal) => {
    switch (goal) {
      case 'WEIGHT_LOSS':
        return 'bi-graph-down-arrow';
      case 'WEIGHT_GAIN':
        return 'bi-graph-up-arrow';
      case 'MAINTENANCE':
        return 'bi-dash-circle';
      default:
        return 'bi-circle';
    }
  };

  const getGoalColor = (goal) => {
    switch (goal) {
      case 'WEIGHT_LOSS':
        return 'text-warning';
      case 'WEIGHT_GAIN':
        return 'text-success';
      case 'MAINTENANCE':
        return 'text-info';
      default:
        return 'text-secondary';
    }
  };

  const getActivityDescription = (level) => {
    switch (level) {
      case 'SEDENTARY':
        return 'Little or no exercise';
      case 'LIGHT':
        return 'Light exercise 1-3 days/week';
      case 'MODERATE':
        return 'Moderate exercise 3-5 days/week';
      case 'ACTIVE':
        return 'Hard exercise 6-7 days/week';
      case 'VERY_ACTIVE':
        return 'Very hard exercise & physical job';
      default:
        return 'Unknown';
    }
  };

  if (!profile) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-person-plus fs-1 text-muted mb-3"></i>
        <h4>Complete Your Profile First</h4>
        <p className="text-muted">
          Please fill out your personal information in the Profile tab to calculate your daily calorie needs.
        </p>
      </div>
    );
  }

  return (
    <div className="row">
      <div className="col-lg-8">
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white">
            <h5 className="card-title mb-0">
              <i className="bi bi-calculator me-2"></i>
              Calorie Calculation Results
            </h5>
            <p className="text-muted small mb-0">
              Based on your profile and fitness goals
            </p>
          </div>
          <div className="card-body">
            {calculation ? (
              <div className="row">
                <div className="col-md-4 mb-4">
                  <div className="text-center">
                    <div className="text-primary mb-2">
                      <i className="bi bi-activity fs-1"></i>
                    </div>
                    <h6 className="text-muted">Basal Metabolic Rate</h6>
                    <h3 className="fw-bold">{Math.round(calculation.bmr)}</h3>
                    <p className="text-muted small">calories/day</p>
                  </div>
                </div>

                <div className="col-md-4 mb-4">
                  <div className="text-center">
                    <div className="text-info mb-2">
                      <i className="bi bi-lightning-charge fs-1"></i>
                    </div>
                    <h6 className="text-muted">Total Daily Energy</h6>
                    <h3 className="fw-bold">{Math.round(calculation.tdee)}</h3>
                    <p className="text-muted small">calories/day</p>
                  </div>
                </div>

                <div className="col-md-4 mb-4">
                  <div className="text-center">
                    <div className={`mb-2 ${getGoalColor(calculation.fitnessGoal)}`}>
                      <i className={`bi ${getGoalIcon(calculation.fitnessGoal)} fs-1`}></i>
                    </div>
                    <h6 className="text-muted">Daily Target</h6>
                    <h3 className="fw-bold">{calculation.dailyCalorieTarget}</h3>
                    <p className="text-muted small">calories/day</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <i className="bi bi-calculator fs-1 text-muted mb-3"></i>
                <h5>Ready to Calculate</h5>
                <p className="text-muted mb-4">
                  Click the button below to see your personalized calorie recommendations
                </p>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => onCalculate()}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Calculating...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-calculator me-2"></i>
                      Calculate My Calories
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {calculation && (
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <h6 className="card-title mb-0">
                <i className="bi bi-info-circle me-2"></i>
                How This Works
              </h6>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <h6 className="fw-semibold mb-3">Calculation Formula</h6>
                  <ul className="small text-muted">
                    <li><strong>BMR:</strong> Mifflin-St Jeor Equation</li>
                    <li><strong>TDEE:</strong> BMR × Activity Factor</li>
                    <li><strong>Goal Adjustment:</strong> ±500 calories/day</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h6 className="fw-semibold mb-3">Your Parameters</h6>
                  <ul className="small text-muted">
                    <li><strong>Age:</strong> {profile.age} years</li>
                    <li><strong>Gender:</strong> {profile.gender}</li>
                    <li><strong>Height:</strong> {profile.heightCm} cm</li>
                    <li><strong>Weight:</strong> {profile.weightKg} kg</li>
                    <li><strong>Activity:</strong> {getActivityDescription(profile.activityLevel)}</li>
                    <li><strong>Goal:</strong> {profile.fitnessGoal.replace('_', ' ')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="col-lg-4">
        <div className="card border-0 shadow-sm mb-3">
          <div className="card-header bg-white">
            <h6 className="card-title mb-0">
              <i className="bi bi-bullseye me-2"></i>
              Goal Details
            </h6>
          </div>
          <div className="card-body">
            <div className="d-flex align-items-center mb-3">
              <div className={`me-3 ${getGoalColor(profile?.fitnessGoal)}`}>
                <i className={`bi ${getGoalIcon(profile?.fitnessGoal)} fs-3`}></i>
              </div>
              <div>
                <h6 className="mb-0">{profile?.fitnessGoal?.replace('_', ' ')}</h6>
                <small className="text-muted">
                  {profile?.fitnessGoal === 'WEIGHT_LOSS' && '500 calorie deficit per day'}
                  {profile?.fitnessGoal === 'WEIGHT_GAIN' && '500 calorie surplus per day'}
                  {profile?.fitnessGoal === 'MAINTENANCE' && 'Maintain current weight'}
                </small>
              </div>
            </div>

            {calculation && (
              <div className="alert alert-info small" role="alert">
                <i className="bi bi-info-circle me-2"></i>
                {calculation.fitnessGoal === 'WEIGHT_LOSS' && 
                  `You'll lose approximately 0.5 kg (1 lb) per week with this calorie target.`}
                {calculation.fitnessGoal === 'WEIGHT_GAIN' && 
                  `You'll gain approximately 0.5 kg (1 lb) per week with this calorie target.`}
                {calculation.fitnessGoal === 'MAINTENANCE' && 
                  `This target will help you maintain your current weight.`}
              </div>
            )}
          </div>
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white">
            <h6 className="card-title mb-0">
              <i className="bi bi-speedometer2 me-2"></i>
              Activity Level Impact
            </h6>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="small">Your Level</span>
                <span className="badge bg-primary">{profile?.activityLevel}</span>
              </div>
              <div className="progress" style={{ height: '6px' }}>
                <div 
                  className="progress-bar bg-primary" 
                  style={{ 
                    width: `${
                      profile?.activityLevel === 'SEDENTARY' ? 20 :
                      profile?.activityLevel === 'LIGHT' ? 40 :
                      profile?.activityLevel === 'MODERATE' ? 60 :
                      profile?.activityLevel === 'ACTIVE' ? 80 : 100
                    }%` 
                  }}
                ></div>
              </div>
            </div>
            <small className="text-muted">
              {getActivityDescription(profile?.activityLevel)}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalorieCalculator;
