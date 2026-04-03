import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";

function CoachSidebar() {
  const navigate = useNavigate();
  const { logout, user } = React.useContext(LoginContext);

  const baseClasses = "list-group-item list-group-item-action border-0 rounded-3 mb-2";

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body p-3">
        <div className="mb-4">
          <p className="text-uppercase text-muted small mb-1">Coach Portal</p>
          <h5 className="mb-0">{user?.fullName || "Coach"}</h5>
          <small className="text-muted">{user?.email}</small>
        </div>

        <div className="list-group list-group-flush">
          <NavLink
            to="/coach/dashboard"
            className={({ isActive }) => `${baseClasses} ${isActive ? "active bg-success border-success" : ""}`}
          >
            Overview
          </NavLink>
          <NavLink
            to="/coach/clients"
            className={({ isActive }) => `${baseClasses} ${isActive ? "active bg-success border-success" : ""}`}
          >
            Clients
          </NavLink>
          <NavLink
            to="/coach/plans"
            className={({ isActive }) => `${baseClasses} ${isActive ? "active bg-success border-success" : ""}`}
          >
            Plans
          </NavLink>
        </div>

        <button
          type="button"
          className="btn btn-outline-danger w-100 mt-4"
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default CoachSidebar;
