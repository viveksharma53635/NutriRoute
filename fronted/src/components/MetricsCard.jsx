import React from "react";

function MetricsCard({ user, plan, water, setWater }) {
  return (
    <div className="col-lg-5">

      {/* Weight */}
      <div className="card shadow-sm border-0 p-4 mb-3">
        <h6 className="text-muted">Weight</h6>
        <h3>{user.weight} kg</h3>
      </div>

      {/* Height */}
      <div className="card shadow-sm border-0 p-4 mb-3">
        <h6 className="text-muted">Height</h6>
        <h3>{user.height} cm</h3>
      </div>

      {/* Insight */}
      <div className="card shadow-sm border-0 p-4 bg-dark text-white mb-3">
        <h6>Daily Insight</h6>
        <p className="mb-0">
          Increase protein by 20g to better support your <b>{user.goalType}</b>.
        </p>
      </div>

      {/* Coach Support */}
      <div className="card shadow-sm border-0 p-4 mb-3">
        <h6>Coach Support</h6>

        {plan === "FREE" && (
          <p className="text-danger">
            Upgrade to Pro to talk with a coach.
          </p>
        )}

        {plan === "PRO" && (
          <p className="text-success">
            Coach access: 30 minutes (alternate days)
          </p>
        )}

        {plan === "PREMIUM" && (
          <p className="text-success">
            Full coach support available.
          </p>
        )}
      </div>

      {/* Water Tracker */}
      <div className="card shadow-sm border-0 p-4">
        <h6>Water Intake</h6>

        <h3>{water} / 8 Glasses</h3>

        <button
          className="btn btn-primary mt-2"
          disabled={water === 8}
          onClick={() => {
            if (water < 8) setWater(water + 1);
          }}
        >
          + Add Glass
        </button>
      </div>

    </div>
  );
}

export default MetricsCard;