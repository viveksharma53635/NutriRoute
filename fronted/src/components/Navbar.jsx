import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";
import "./Navbar.css";

function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useContext(LoginContext);
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminUser = typeof isAdmin === "function" ? isAdmin() : false;
  const isProfileRoute = location.pathname === "/profile";
  const profileInitial = (user?.fullName || user?.name || user?.email || "U").trim().charAt(0).toUpperCase();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-glass sticky-top">
      <div className="container-fluid">
        
        {/* BRAND */}
        <Link className="navbar-brand" to="/">
          <i className="bi bi-leaf-fill"></i>
          {!isProfileRoute && "NutriRoute"}
        </Link>

        {/* MOBILE TOGGLE */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          
          {/* NAVIGATION LINKS */}
          <ul className="navbar-nav mx-auto">
            {!isAuthenticated ? (
              // PUBLIC NAVIGATION (Logged Out)
              <>
                <li className="nav-item">
                  <Link className={`nav-link ${location.pathname === "/" ? "active" : ""}`} to="/">
                    <i className="bi bi-house-door me-1"></i>
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${location.pathname === "/diet-planner" ? "active" : ""}`} to="/diet-planner">
                    <i className="bi bi-clipboard2-pulse me-1"></i>
                    Diet Planner
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${location.pathname === "/healthy-recipes" ? "active" : ""}`} to="/healthy-recipes">
                    <i className="bi bi-basket me-1"></i>
                    Healthy Recipes
                  </Link>
                </li>
              </>
            ) : isAdminUser ? (
              <></>
            ) : (
              // USER NAVIGATION (Logged In)
              <>
                <li className="nav-item">
                  <Link className={`nav-link ${location.pathname === "/" ? "active" : ""}`} to="/">
                    <i className="bi bi-house-door me-1"></i>
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${location.pathname === "/dashboard" ? "active" : ""}`} to="/dashboard">
                    <i className="bi bi-speedometer2 me-1"></i>
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${location.pathname === "/diet-planner" ? "active" : ""}`} to="/diet-planner">
                    <i className="bi bi-clipboard2-pulse me-1"></i>
                    Diet Planner
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${location.pathname === "/healthy-recipes" ? "active" : ""}`} to="/healthy-recipes">
                    <i className="bi bi-basket me-1"></i>
                    Healthy Recipes
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${location.pathname === "/track-progress" ? "active" : ""}`} to="/track-progress">
                    <i className="bi bi-graph-up me-1"></i>
                    Track Progress
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* RIGHT SECTION */}
          <div className="d-flex align-items-center gap-3">
            
            {/* Calories Badge - Only show when logged in */}
            {isAuthenticated && (
              <div className="calories-badge d-none d-md-flex align-items-center">
                <span className="text-muted me-1">Daily:</span>
                <span className="calories-value">1,200</span>
                <span className="text-muted ms-1">/ 2,000 kcal</span>
              </div>
            )}

            {/* LOGIN / PROFILE SECTION */}
            {isAuthenticated ? (
              <div className="dropdown">
                <button
                  className="btn btn-link position-relative p-0 border-0 bg-transparent"
                  type="button"
                  id="profileDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <div className="profile-avatar profile-avatar-initial" aria-label="User Profile">
                    {profileInitial}
                  </div>
                </button>
                
                <ul className="dropdown-menu dropdown-menu-custom dropdown-menu-end" aria-labelledby="profileDropdown">
                  <li>
                    <button
                      type="button"
                      className="dropdown-item dropdown-item-custom"
                      onClick={() => navigate("/profile")}
                    >
                      <i className="bi bi-person"></i>
                      Profile
                    </button>
                  </li>
                  <li>
                    <Link className="dropdown-item dropdown-item-custom" to="/settings">
                      <i className="bi bi-gear"></i>
                      Settings
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item dropdown-item-custom text-danger" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right"></i>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link className="btn btn-login" to="/login">
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Login
              </Link>
            )}
            
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
