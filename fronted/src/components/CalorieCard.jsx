import React from 'react'

function CalorieCard({ user, progressColor, progress, remainingCalories }) {
  return (
    <>
        {/* CALORIE CARD */}
          <div className="col-lg-7">
            <div className="card shadow-sm border-0 p-4">
              <h5 className="fw-bold mb-3">Daily Calories</h5>

              <div className="d-flex justify-content-between mb-2">
                <span>{user.consumed} kcal</span>
                <span>{user.dailyGoal} kcal</span>
              </div>

              <div className="progress mb-3" style={{ height: "20px" }}>
                <div
                  className={`progress-bar ${progressColor} progress-bar-striped`}
                  style={{ width: `${progress}%` }}
                >
                  {Math.round(progress)}%
                </div>
              </div>

              <h4 className="text-success">{remainingCalories} kcal left</h4>

              <div className="row text-center mt-4">
                <div className="col">
                  <small className="text-muted">Protein</small>
                  <h6>{user.protein}g / 120g</h6>
                </div>
                <div className="col">
                  <small className="text-muted">Carbs</small>
                  <h6>{user.carbs}g / 250g</h6>
                </div>
                <div className="col">
                  <small className="text-muted">Fats</small>
                  <h6>{user.fats}g / 70g</h6>
                </div>
              </div>
            </div>
          </div>
    </>
  )
}

export default CalorieCard