import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from "axios";

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard analytics
  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError('Failed to load dashboard analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Prepare chart data
  const dietPlanChartData = analytics?.dietPlanDistribution ? 
    Object.entries(analytics.dietPlanDistribution).map(([type, count]) => ({
      name: type.replace('_', ' '),
      value: count
    })) : [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (loading) {
    return (
      <div className="container-fluid bg-light py-4" style={{ minHeight: "100vh" }}>
        <div className="container text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid bg-light py-4" style={{ minHeight: "100vh" }}>
        <div className="container">
          <div className="alert alert-danger">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid bg-light py-4" style={{ minHeight: "100vh" }}>
      <div className="container">
        {/* HEADER */}
        <div className="row mb-4">
          <div className="col-12">
            <h2 className="fw-bold">Admin Dashboard</h2>
            <p className="text-muted">System analytics and overview</p>
          </div>
        </div>

        {/* KPI CARDS */}
        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title text-primary">Total Users</h5>
                <h2 className="fw-bold">{analytics?.totalUsers || 0}</h2>
                <small className="text-muted">Registered users</small>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title text-success">Active Users</h5>
                <h2 className="fw-bold">{analytics?.activeUsers || 0}</h2>
                <small className="text-muted">Users with active diet plans</small>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title text-info">Diet Plans</h5>
                <h2 className="fw-bold">{analytics?.totalDietPlans || 0}</h2>
                <small className="text-muted">Available diet plans</small>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title text-warning">Total Meals</h5>
                <h2 className="fw-bold">{analytics?.totalMeals || 0}</h2>
                <small className="text-muted">Meals in system</small>
              </div>
            </div>
          </div>
        </div>

        {/* ADDITIONAL METRICS */}
        <div className="row mb-4">
          <div className="col-md-6 mb-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title text-secondary">New Users (30 days)</h5>
                <h2 className="fw-bold">{analytics?.userRegistrationsLast30Days || 0}</h2>
                <small className="text-muted">Recent registrations</small>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title text-dark">User Engagement</h5>
                <h2 className="fw-bold">
                  {analytics?.totalUsers > 0 ? 
                    Math.round((analytics.activeUsers / analytics.totalUsers) * 100) : 0}%
                </h2>
                <small className="text-muted">Active user percentage</small>
              </div>
            </div>
          </div>
        </div>

        {/* CHARTS */}
        <div className="row">
          {/* DIET PLAN DISTRIBUTION PIE CHART */}
          <div className="col-md-6 mb-4">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Diet Plan Distribution</h5>
              </div>
              <div className="card-body">
                {dietPlanChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={dietPlanChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {dietPlanChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted">No diet plan data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* DIET PLAN BAR CHART */}
          <div className="col-md-6 mb-4">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Diet Plan Usage</h5>
              </div>
              <div className="card-body">
                {dietPlanChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dietPlanChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" name="Number of Plans" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted">No diet plan data available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Quick Actions</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3 mb-2">
                    <button
                      className="btn btn-primary w-100"
                      onClick={() => navigate("/admin/diet-plans")}
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      Create Diet Plan
                    </button>
                  </div>
                  <div className="col-md-3 mb-2">
                    <button className="btn btn-success w-100">
                      <i className="bi bi-egg-fried me-2"></i>
                      Create Meal
                    </button>
                  </div>
                  <div className="col-md-3 mb-2">
                    <button className="btn btn-info w-100">
                      <i className="bi bi-people me-2"></i>
                      Manage Users
                    </button>
                  </div>
                  <div className="col-md-3 mb-2">
                    <button 
                      className="btn btn-secondary w-100"
                      onClick={fetchAnalytics}
                    >
                      <i className="bi bi-arrow-clockwise me-2"></i>
                      Refresh Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
