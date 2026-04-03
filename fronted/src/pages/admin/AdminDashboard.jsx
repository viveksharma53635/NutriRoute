import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { authService } from "../../services/apiService";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/admin-dashboard.css";

const CHART_COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#7c3aed", "#0f766e"];

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [showMealModal, setShowMealModal] = useState(false);
  const [showDietPlanModal, setShowDietPlanModal] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const [editingDietPlan, setEditingDietPlan] = useState(null);
  const [savingMeal, setSavingMeal] = useState(false);
  const [savingDietPlan, setSavingDietPlan] = useState(false);
  const [availableDietPlans, setAvailableDietPlans] = useState([]);
  const [mealForm, setMealForm] = useState({
    name: "",
    description: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    mealType: "BREAKFAST",
    dietPlanId: "",
  });
  const [dietPlanForm, setDietPlanForm] = useState({
    name: "",
    description: "",
    type: "BALANCED",
    durationDays: "",
    targetCaloriesPerDay: "",
    targetProteinPerDay: "",
    targetCarbsPerDay: "",
    targetFatPerDay: "",
    active: true,
  });

  useEffect(() => {
    initializeDashboard();
  }, []);

  const initializeDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      await Promise.all([fetchDashboardData(false), fetchDietPlans()]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDietPlans = async () => {
    try {
      const response = await authService.getAdminDietPlans();
      setAvailableDietPlans(Array.isArray(response.data) ? response.data : response.data?.dietPlans || []);
    } catch (requestError) {
      console.error("Error fetching diet plans for admin dashboard:", requestError);
    }
  };

  const fetchDashboardData = async (showRefreshState = true) => {
    try {
      if (showRefreshState) {
        setRefreshing(true);
      }
      setError("");
      const response = await authService.getAnalytics();
      setDashboardData(response.data);
    } catch (requestError) {
      if (requestError.response?.status === 401) {
        setError("Authentication error. Please sign in again with admin access.");
      } else if (requestError.response?.status === 403) {
        setError("Access denied. You need admin privileges to view this dashboard.");
      } else if (requestError.response?.status === 404) {
        setError("Dashboard analytics endpoint is not available.");
      } else {
        setError("Failed to load dashboard data: " + (requestError.response?.data?.message || requestError.message));
      }
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddMeal = () => {
    setEditingMeal(null);
    setMealForm({
      name: "",
      description: "",
      calories: "",
      protein: "",
      carbs: "",
      fat: "",
      mealType: "BREAKFAST",
      dietPlanId: "",
    });
    setShowMealModal(true);
  };

  const handleSaveMeal = async () => {
    try {
      setError("");
      setSavingMeal(true);

      if (!mealForm.name.trim()) {
        setError("Meal name is required");
        return;
      }
      if (!mealForm.calories || Number(mealForm.calories) <= 0) {
        setError("Calories must be a positive number");
        return;
      }
      if (!mealForm.dietPlanId) {
        setError("Please select a diet plan");
        return;
      }

      const mealData = {
        name: mealForm.name.trim(),
        description: mealForm.description || "",
        calories: parseInt(mealForm.calories, 10),
        protein: mealForm.protein !== "" ? parseFloat(mealForm.protein) : 0,
        carbs: mealForm.carbs !== "" ? parseFloat(mealForm.carbs) : 0,
        fat: mealForm.fat !== "" ? parseFloat(mealForm.fat) : 0,
        mealType: mealForm.mealType || "BREAKFAST",
        dietPlanId: mealForm.dietPlanId,
      };

      if (editingMeal) {
        await authService.updateAdminMeal(editingMeal.id, mealData);
      } else {
        await authService.createAdminMeal(mealData);
      }

      setShowMealModal(false);
      setEditingMeal(null);
      fetchDashboardData();
    } catch (requestError) {
      const status = requestError.response?.status;
      if (status === 400) {
        setError("Invalid meal data. Please review the form and try again.");
      } else if (status === 401) {
        setError("Authentication expired. Please sign in again.");
      } else if (status === 403) {
        setError("You do not have permission to create meals.");
      } else {
        setError("Failed to save meal");
      }
    } finally {
      setSavingMeal(false);
    }
  };

  const handleAddDietPlan = () => {
    setEditingDietPlan(null);
    setDietPlanForm({
      name: "",
      description: "",
      type: "BALANCED",
      durationDays: "",
      targetCaloriesPerDay: "",
      targetProteinPerDay: "",
      targetCarbsPerDay: "",
      targetFatPerDay: "",
      active: true,
    });
    setShowDietPlanModal(true);
  };

  const handleSaveDietPlan = async () => {
    try {
      setError("");
      setSavingDietPlan(true);

      if (!dietPlanForm.name.trim()) {
        setError("Diet plan name is required");
        return;
      }

      const payload = {
        name: dietPlanForm.name.trim(),
        description: dietPlanForm.description.trim(),
        type: dietPlanForm.type || "BALANCED",
        durationDays: Number(dietPlanForm.durationDays),
        targetCaloriesPerDay: Number(dietPlanForm.targetCaloriesPerDay),
        targetProteinPerDay: Number(dietPlanForm.targetProteinPerDay),
        targetCarbsPerDay: Number(dietPlanForm.targetCarbsPerDay),
        targetFatPerDay: Number(dietPlanForm.targetFatPerDay),
        active: Boolean(dietPlanForm.active),
      };

      if (
        payload.durationDays <= 0 ||
        payload.targetCaloriesPerDay <= 0 ||
        payload.targetProteinPerDay < 0 ||
        payload.targetCarbsPerDay < 0 ||
        payload.targetFatPerDay < 0
      ) {
        setError("Please enter valid diet plan targets before saving.");
        return;
      }

      if (editingDietPlan) {
        await authService.updateAdminDietPlan(editingDietPlan.id, payload);
      } else {
        await authService.createAdminDietPlan(payload);
      }
      setShowDietPlanModal(false);
      setEditingDietPlan(null);
      fetchDashboardData();
    } catch (requestError) {
      console.error("Error saving diet plan:", requestError);
      setError(requestError.response?.data?.message || "Failed to save diet plan");
    } finally {
      setSavingDietPlan(false);
    }
  };

  const stats = [
    { label: "Total Users", value: dashboardData?.totalUsers || 0, hint: `${dashboardData?.userRegistrationsLast30Days || 0} new in last 30 days`, icon: "bi-people", className: "metric-card--blue" },
    { label: "Active Diet Plans", value: dashboardData?.activeDietPlans || 0, hint: `${dashboardData?.activeUsers || 0} users assigned`, icon: "bi-clipboard2-pulse", className: "metric-card--green" },
    { label: "Total Meals", value: dashboardData?.totalMeals || 0, hint: `${Object.keys(dashboardData?.mealTypeDistribution || {}).length} categories`, icon: "bi-egg-fried", className: "metric-card--amber" },
    { label: "Meal Logs Today", value: dashboardData?.mealLogsToday || 0, hint: "Activity across the platform", icon: "bi-journal-check", className: "metric-card--slate" },
  ];

  const userGrowthData = Object.entries(dashboardData?.userGrowth || {}).map(([month, users]) => ({ month, users }));
  const mealDistributionData = Object.entries(dashboardData?.mealTypeDistribution || {}).map(([name, value]) => ({ name, value }));
  const recentUsers = dashboardData?.recentUsers || [];
  const quickActions = [
    { type: "link", to: "/admin/users", label: "Manage Users", subtitle: "Review accounts and roles", icon: "bi-people-fill", tone: "admin-action-card--blue" },
    { type: "button", action: handleAddMeal, label: "Create Meal", subtitle: "Add a new meal template", icon: "bi-plus-circle-fill", tone: "admin-action-card--green" },
    { type: "button", action: handleAddDietPlan, label: "Create Diet Plan", subtitle: "Configure a nutrition plan", icon: "bi-clipboard2-plus-fill", tone: "admin-action-card--violet" },
    { type: "button", action: () => fetchDashboardData(), label: refreshing ? "Refreshing..." : "Refresh Data", subtitle: "Pull the latest analytics", icon: "bi-arrow-repeat", tone: "admin-action-card--slate" },
  ];

  const trendData = userGrowthData.map((entry, index, source) => ({
    ...entry,
    trend: entry.users,
    movingAverage:
      source.length > 1
        ? Number(
            (
              source
                .slice(Math.max(0, index - 1), Math.min(source.length, index + 2))
                .reduce((sum, item) => sum + item.users, 0) /
              source.slice(Math.max(0, index - 1), Math.min(source.length, index + 2)).length
            ).toFixed(1)
          )
        : entry.users,
  }));

  const renderLoadingState = () => (
    <div className="container-fluid py-4">
      <div className="row g-4">
        {[0, 1, 2, 3].map((item) => (
          <div className="col-sm-6 col-xl-3" key={item}>
            <div className="card admin-panel admin-skeleton">
              <div className="card-body placeholder-glow">
                <span className="placeholder col-5 mb-3"></span>
                <span className="placeholder col-7 mb-2"></span>
                <span className="placeholder col-4"></span>
              </div>
            </div>
          </div>
        ))}
        <div className="col-12 col-xl-8">
          <div className="card admin-panel chart-panel">
            <div className="card-body placeholder-glow">
              <span className="placeholder col-4 mb-3"></span>
              <span className="placeholder col-12" style={{ minHeight: "250px" }}></span>
            </div>
          </div>
        </div>
        <div className="col-12 col-xl-4">
          <div className="card admin-panel chart-panel">
            <div className="card-body placeholder-glow">
              <span className="placeholder col-5 mb-3"></span>
              <span className="placeholder col-12" style={{ minHeight: "250px" }}></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard-page">
      <div className="card admin-panel admin-hero admin-hero--dashboard mb-4">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="badge text-bg-light border">Dashboard Overview</span>
              <span className="badge admin-hero__badge">Live SaaS metrics</span>
            </div>
            <h1 className="h2 fw-bold mb-1">Welcome back to NutriRoute Admin</h1>
            <p className="text-muted mb-0">
              Track users, monitor meal activity, and jump into core admin workflows from a single workspace.
            </p>
          </div>
          <div className="d-flex flex-wrap gap-2">
            <button className="btn btn-outline-secondary" onClick={() => fetchDashboardData()}>
              <i className="bi bi-arrow-clockwise me-2"></i>
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
            <button className="btn btn-success" onClick={handleAddMeal}>
              <i className="bi bi-plus-circle me-2"></i>
              Create Meal
            </button>
            <button className="btn btn-primary" onClick={handleAddDietPlan}>
              <i className="bi bi-clipboard2-plus me-2"></i>
              Create Diet Plan
            </button>
          </div>
        </div>
      </div>

      <div className="container-fluid px-0">
            {error && (
              <div className="alert alert-danger d-flex justify-content-between align-items-start gap-3 shadow-sm" role="alert">
                <div>
                  <div className="fw-semibold mb-1">Dashboard issue</div>
                  <div>{error}</div>
                </div>
                <div className="d-flex gap-2">
                  <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => setError("")}>
                    Dismiss
                  </button>
                  <button type="button" className="btn btn-sm btn-danger" onClick={initializeDashboard}>
                    Retry
                  </button>
                </div>
              </div>
            )}

            {loading ? renderLoadingState() : (
              <>
                <div className="row g-4 mb-4">
                  {stats.map((stat) => (
                    <div className="col-sm-6 col-xl-3" key={stat.label}>
                      <div className={`card admin-panel metric-card admin-stat-card ${stat.className}`}>
                        <div className="card-body p-4">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <div className="small text-white-50 mb-2">{stat.label}</div>
                              <div className="display-6 fw-bold mb-1">{stat.value}</div>
                              <div className="small text-white-50">{stat.hint}</div>
                            </div>
                            <div className="metric-card__icon bg-white bg-opacity-10 text-white">
                              <i className={`bi ${stat.icon}`}></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="row g-4 mb-4">
                  <div className="col-12 col-xl-8">
                    <div className="card admin-panel chart-panel">
                      <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div>
                            <h5 className="mb-1">User Activity Trends</h5>
                            <p className="text-muted mb-0">Registration momentum and short-term movement over the last six months</p>
                          </div>
                          <span className="badge text-bg-light border">Trend</span>
                        </div>
                        {trendData.length > 0 ? (
                          <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={trendData}>
                              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                              <XAxis dataKey="month" stroke="#64748b" />
                              <YAxis allowDecimals={false} stroke="#64748b" />
                              <Tooltip />
                              <Area type="monotone" dataKey="movingAverage" stroke="#93c5fd" fill="#dbeafe" fillOpacity={0.9} />
                              <Line type="monotone" dataKey="trend" stroke="#2563eb" strokeWidth={3} dot={{ r: 4, fill: "#2563eb" }} activeDot={{ r: 6 }} />
                            </AreaChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="admin-empty-state">No user growth data is available yet.</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-xl-4">
                    <div className="card admin-panel chart-panel">
                      <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div>
                            <h5 className="mb-1">Meal Category Distribution</h5>
                            <p className="text-muted mb-0">Meal types currently configured</p>
                          </div>
                          <span className="badge text-bg-light border">Meals</span>
                        </div>
                        {mealDistributionData.length > 0 ? (
                          <>
                            <ResponsiveContainer width="100%" height={260}>
                              <PieChart>
                                <Pie data={mealDistributionData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={94} paddingAngle={4}>
                                  {mealDistributionData.map((entry, index) => (
                                    <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip />
                              </PieChart>
                            </ResponsiveContainer>
                            <div className="d-flex flex-wrap gap-2 mt-3">
                              {mealDistributionData.map((entry, index) => (
                                <span key={entry.name} className="badge rounded-pill text-bg-light border">
                                  <i className="bi bi-circle-fill me-2" style={{ color: CHART_COLORS[index % CHART_COLORS.length], fontSize: "0.65rem" }}></i>
                                  {entry.name}: {entry.value}
                                </span>
                              ))}
                            </div>
                          </>
                        ) : (
                          <div className="admin-empty-state">Create meals to populate category insights.</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row g-4 mb-4">
                  <div className="col-12 col-xl-4">
                    <div className="card admin-panel h-100">
                      <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div>
                            <h5 className="mb-1">Quick Actions</h5>
                            <p className="text-muted mb-0">Card-based shortcuts for the most common admin tasks</p>
                          </div>
                          <i className="bi bi-lightning-charge text-warning fs-4"></i>
                        </div>
                        <div className="row g-3">
                          {quickActions.map((item) => (
                            <div className="col-12 col-sm-6 col-xl-12" key={item.label}>
                              {item.type === "link" ? (
                                <Link to={item.to} className={`admin-action-card ${item.tone}`}>
                                  <div className="admin-action-card__icon">
                                    <i className={`bi ${item.icon}`}></i>
                                  </div>
                                  <div className="admin-action-card__body">
                                    <div className="fw-semibold">{item.label}</div>
                                    <small>{item.subtitle}</small>
                                  </div>
                                  <i className="bi bi-arrow-up-right admin-action-card__arrow"></i>
                                </Link>
                              ) : (
                                <button type="button" className={`admin-action-card ${item.tone}`} onClick={item.action}>
                                  <div className="admin-action-card__icon">
                                    <i className={`bi ${item.icon}`}></i>
                                  </div>
                                  <div className="admin-action-card__body">
                                    <div className="fw-semibold">{item.label}</div>
                                    <small>{item.subtitle}</small>
                                  </div>
                                  <i className="bi bi-arrow-up-right admin-action-card__arrow"></i>
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-xl-8">
                    <div className="card admin-panel h-100">
                      <div className="card-body p-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div>
                            <h5 className="mb-1">Recent Users</h5>
                            <p className="text-muted mb-0">Latest accounts created in NutriRoute</p>
                          </div>
                          <Link to="/admin/users" className="btn btn-sm btn-outline-primary">
                            View all
                          </Link>
                        </div>

                        {recentUsers.length > 0 ? (
                          <div className="table-responsive">
                            <table className="table recent-users-table align-middle">
                              <thead>
                                <tr>
                                  <th>User</th>
                                  <th>Role</th>
                                  <th>Joined</th>
                                  <th className="text-end">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {recentUsers.map((user) => (
                                  <tr key={user.id}>
                                    <td>
                                      <div className="d-flex align-items-center gap-3">
                                        <div className="user-avatar">{(user.name || "U").charAt(0).toUpperCase()}</div>
                                        <div>
                                          <div className="fw-semibold">{user.name}</div>
                                          <div className="text-muted small">{user.email}</div>
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <span className={`badge rounded-pill ${user.role === "ROLE_ADMIN" ? "text-bg-danger" : "text-bg-primary"}`}>
                                        {user.role === "ROLE_ADMIN" ? "Admin" : "User"}
                                      </span>
                                    </td>
                                    <td className="text-muted">
                                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Recently"}
                                    </td>
                                    <td className="text-end">
                                      <Link to="/admin/users" className="btn btn-sm btn-outline-secondary">
                                        Review
                                      </Link>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="admin-empty-state">
                            <div className="admin-empty-state__icon">
                              <i className="bi bi-people"></i>
                            </div>
                            <h6 className="mb-2">No recent users yet</h6>
                            <p className="mb-3">New registrations will appear here once users start joining NutriRoute.</p>
                            <Link to="/admin/users" className="btn btn-outline-primary btn-sm">
                              Open user management
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
      </div>

      <div className={`modal fade ${showMealModal ? "show" : ""}`} style={{ display: showMealModal ? "block" : "none" }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{editingMeal ? "Edit Meal" : "Create New Meal"}</h5>
              <button type="button" className="btn-close" onClick={() => setShowMealModal(false)}></button>
            </div>
            <div className="modal-body">
              <form id="mealForm" onSubmit={(event) => { event.preventDefault(); handleSaveMeal(); }}>
                <div className="mb-3">
                  <label className="form-label">Meal Name</label>
                  <input type="text" className="form-control" value={mealForm.name} onChange={(event) => setMealForm({ ...mealForm, name: event.target.value })} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" value={mealForm.description} onChange={(event) => setMealForm({ ...mealForm, description: event.target.value })} />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Calories</label>
                    <input type="number" className="form-control" value={mealForm.calories} onChange={(event) => setMealForm({ ...mealForm, calories: event.target.value })} required min="1" />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Category</label>
                    <select className="form-select" value={mealForm.mealType} onChange={(event) => setMealForm({ ...mealForm, mealType: event.target.value })}>
                      <option value="BREAKFAST">Breakfast</option>
                      <option value="LUNCH">Lunch</option>
                      <option value="DINNER">Dinner</option>
                      <option value="SNACK">Snack</option>
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Diet Plan</label>
                  <select className="form-select" value={mealForm.dietPlanId} onChange={(event) => setMealForm({ ...mealForm, dietPlanId: event.target.value })} required>
                    <option value="">Select a diet plan</option>
                    {availableDietPlans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Protein (g)</label>
                    <input type="number" className="form-control" value={mealForm.protein} onChange={(event) => setMealForm({ ...mealForm, protein: event.target.value })} min="0" step="0.1" />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Carbs (g)</label>
                    <input type="number" className="form-control" value={mealForm.carbs} onChange={(event) => setMealForm({ ...mealForm, carbs: event.target.value })} min="0" step="0.1" />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Fat (g)</label>
                    <input type="number" className="form-control" value={mealForm.fat} onChange={(event) => setMealForm({ ...mealForm, fat: event.target.value })} min="0" step="0.1" />
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowMealModal(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" form="mealForm" disabled={savingMeal}>
                {savingMeal ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : (
                  <>{editingMeal ? "Update Meal" : "Create Meal"}</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`modal fade ${showDietPlanModal ? "show" : ""}`} style={{ display: showDietPlanModal ? "block" : "none" }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{editingDietPlan ? "Edit Diet Plan" : "Create New Diet Plan"}</h5>
              <button type="button" className="btn-close" onClick={() => setShowDietPlanModal(false)}></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-5 mb-3">
                  <label className="form-label">Plan Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={dietPlanForm.name}
                    onChange={(event) => setDietPlanForm({ ...dietPlanForm, name: event.target.value })}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Plan Type</label>
                  <select
                    className="form-select"
                    value={dietPlanForm.type}
                    onChange={(event) => setDietPlanForm({ ...dietPlanForm, type: event.target.value })}
                  >
                    <option value="BALANCED">Balanced</option>
                    <option value="WEIGHT_LOSS">Weight Loss</option>
                    <option value="MUSCLE_GAIN">Muscle Gain</option>
                    <option value="KETO">Keto</option>
                  </select>
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Duration (days)</label>
                  <input
                    type="number"
                    className="form-control"
                    min="1"
                    value={dietPlanForm.durationDays}
                    onChange={(event) => setDietPlanForm({ ...dietPlanForm, durationDays: event.target.value })}
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={dietPlanForm.description}
                  onChange={(event) => setDietPlanForm({ ...dietPlanForm, description: event.target.value })}
                />
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Target Calories</label>
                  <input
                    type="number"
                    className="form-control"
                    min="1"
                    value={dietPlanForm.targetCaloriesPerDay}
                    onChange={(event) => setDietPlanForm({ ...dietPlanForm, targetCaloriesPerDay: event.target.value })}
                  />
                </div>
                <div className="col-md-6 mb-3 d-flex align-items-end">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="dietPlanActive"
                      checked={dietPlanForm.active}
                      onChange={(event) => setDietPlanForm({ ...dietPlanForm, active: event.target.checked })}
                    />
                    <label className="form-check-label" htmlFor="dietPlanActive">
                      Active plan
                    </label>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Protein (g/day)</label>
                  <input
                    type="number"
                    className="form-control"
                    min="0"
                    step="0.1"
                    value={dietPlanForm.targetProteinPerDay}
                    onChange={(event) => setDietPlanForm({ ...dietPlanForm, targetProteinPerDay: event.target.value })}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Carbs (g/day)</label>
                  <input
                    type="number"
                    className="form-control"
                    min="0"
                    step="0.1"
                    value={dietPlanForm.targetCarbsPerDay}
                    onChange={(event) => setDietPlanForm({ ...dietPlanForm, targetCarbsPerDay: event.target.value })}
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Fat (g/day)</label>
                  <input
                    type="number"
                    className="form-control"
                    min="0"
                    step="0.1"
                    value={dietPlanForm.targetFatPerDay}
                    onChange={(event) => setDietPlanForm({ ...dietPlanForm, targetFatPerDay: event.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowDietPlanModal(false)}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={handleSaveDietPlan} disabled={savingDietPlan}>
                {savingDietPlan ? "Saving..." : editingDietPlan ? "Update Diet Plan" : "Create Diet Plan"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
