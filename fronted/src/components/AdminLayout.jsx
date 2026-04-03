import React, { useContext, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";
import "../styles/admin-layout.css";

const AdminLayout = () => {
  const { user, logout } = useContext(LoginContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navItems = [
    { to: "/admin/dashboard", label: "Overview", icon: "bi-grid-1x2" },
    { to: "/admin/users", label: "Users", icon: "bi-people" },
    { to: "/admin/meals", label: "Meals", icon: "bi-egg-fried" },
    { to: "/admin/diet-plans", label: "Diet Plans", icon: "bi-clipboard2-pulse" },
    { to: "/admin/subscriptions", label: "Subscriptions", icon: "bi-stars" },
    { to: "/admin/payments", label: "Payments", icon: "bi-credit-card" },
    { to: "/admin/analytics", label: "Analytics", icon: "bi-bar-chart-line" },
  ];

  return (
    <div className={`admin-layout ${sidebarCollapsed ? "admin-layout--collapsed" : ""}`}>
      <aside className={`admin-layout__sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <div className="admin-layout__brand">
          <div className="admin-layout__logo">
            <i className="bi bi-shield-check"></i>
          </div>
          <div className="admin-layout__brand-copy">
            <div className="fw-semibold text-white">NutriRoute Admin</div>
            <small className="text-white-50">Control center</small>
          </div>
          <button
            type="button"
            className="btn btn-sm admin-layout__collapse-btn d-none d-lg-inline-flex"
            onClick={() => setSidebarCollapsed((current) => !current)}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <i className={`bi ${sidebarCollapsed ? "bi-chevron-right" : "bi-chevron-left"}`}></i>
          </button>
        </div>

        <nav className="admin-layout__nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `admin-layout__nav-link ${isActive ? "active" : ""}`
              }
              onClick={() => setSidebarOpen(false)}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <i className={`bi ${item.icon}`}></i>
              <span className="admin-layout__nav-text">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-layout__sidebar-footer">
          <div className="admin-layout__sidebar-card">
            <div className="admin-layout__sidebar-card-icon">
              <i className="bi bi-stars"></i>
            </div>
            <div className="admin-layout__sidebar-card-copy">
              <div className="fw-semibold">Admin Workspace</div>
              <small>Manage users, meals, and plans faster.</small>
            </div>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          className="admin-layout__backdrop d-lg-none"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      <div className="admin-layout__main">
        <header className="admin-layout__topbar">
          <div className="d-flex align-items-center gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary d-lg-none"
              onClick={() => setSidebarOpen(true)}
            >
              <i className="bi bi-list"></i>
            </button>
            <div>
              <div className="admin-layout__topbar-title">Admin Dashboard</div>
              <small className="text-muted">Manage NutriRoute from one workspace</small>
            </div>
          </div>

          <div className="d-flex align-items-center gap-3">
            <div className="admin-layout__header-badge d-none d-lg-inline-flex">
              <i className="bi bi-shield-lock me-2"></i>
              Secure admin session
            </div>
            <div className="admin-layout__profile d-none d-md-flex">
              <div className="admin-layout__avatar">
                {(user?.fullName || user?.name || "A").charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="fw-semibold small">{user?.fullName || user?.name || "Admin"}</div>
                <small className="text-muted">{user?.email || "admin@nutriroute"}</small>
              </div>
            </div>
            <button type="button" className="btn btn-outline-danger btn-sm" onClick={logout}>
              <i className="bi bi-box-arrow-right me-2"></i>
              Logout
            </button>
          </div>
        </header>

        <section className="admin-layout__content">
          <Outlet />
        </section>
      </div>
    </div>
  );
};

export default AdminLayout;
