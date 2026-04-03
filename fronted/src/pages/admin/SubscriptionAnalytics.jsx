import React, { useEffect, useState } from "react";
import { authService } from "../../services/apiService";
import "bootstrap/dist/css/bootstrap.min.css";

const SubscriptionAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await authService.getAnalytics();
      setAnalyticsData(response.data);
    } catch (requestError) {
      console.error("Error fetching analytics:", requestError);
      setError("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h3 mb-1">Admin Analytics</h1>
              <p className="text-muted mb-0">High-level product metrics for the admin team</p>
            </div>
            <button className="btn btn-outline-primary" onClick={fetchAnalytics}>
              <i className="bi bi-arrow-clockwise me-2"></i>
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <h3 className="text-primary">{analyticsData?.totalUsers || 0}</h3>
              <p className="text-muted mb-0">Total Users</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <h3 className="text-success">{analyticsData?.activeUsers || 0}</h3>
              <p className="text-muted mb-0">Active Users</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <h3 className="text-warning">{analyticsData?.activeDietPlans || 0}</h3>
              <p className="text-muted mb-0">Active Diet Plans</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <h3 className="text-info">{analyticsData?.totalMeals || 0}</h3>
              <p className="text-muted mb-0">Total Meals</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0">Analytics Summary</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <tbody>
                    <tr>
                      <th>Meals Logged Today</th>
                      <td>{analyticsData?.mealLogsToday || 0}</td>
                    </tr>
                    <tr>
                      <th>Registrations in Last 30 Days</th>
                      <td>{analyticsData?.userRegistrationsLast30Days || 0}</td>
                    </tr>
                    <tr>
                      <th>Meal Categories</th>
                      <td>{Object.keys(analyticsData?.mealTypeDistribution || {}).length}</td>
                    </tr>
                    <tr>
                      <th>Recent Users Tracked</th>
                      <td>{analyticsData?.recentUsers?.length || 0}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionAnalytics;
