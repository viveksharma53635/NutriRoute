import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CoachSidebar from "../components/CoachSidebar";
import { authService } from "../services/apiService";
import { LoginContext } from "../context/LoginContext";

function CoachDashboard() {
  const navigate = useNavigate();
  const { isCoach } = useContext(LoginContext);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isCoach()) {
      navigate("/login");
      return;
    }

    const loadDashboard = async () => {
      try {
        const response = await authService.getCoachDashboard();
        setDashboard(response.data);
      } catch (error) {
        console.error("Failed to load coach dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [isCoach, navigate]);

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">
      <div className="row g-4">
        <div className="col-lg-3">
          <CoachSidebar />
        </div>

        <div className="col-lg-9">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <p className="text-uppercase text-muted small mb-1">Dashboard</p>
              <h2 className="mb-0">Coach Overview</h2>
            </div>
          </div>

          {loading ? (
            <div className="d-flex justify-content-center py-5">
              <div className="spinner-border text-success" role="status" />
            </div>
          ) : (
            <>
              <div className="row g-3 mb-4">
                <div className="col-md-6 col-xl-3">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <p className="text-muted mb-1">Assigned Clients</p>
                      <h3 className="mb-0">{dashboard?.totalClients || 0}</h3>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-xl-3">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <p className="text-muted mb-1">Active Plans</p>
                      <h3 className="mb-0">{dashboard?.activePlans || 0}</h3>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-xl-3">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <p className="text-muted mb-1">Diet Plans</p>
                      <h3 className="mb-0">{dashboard?.dietPlans || 0}</h3>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-xl-3">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <p className="text-muted mb-1">Workout Plans</p>
                      <h3 className="mb-0">{dashboard?.workoutPlans || 0}</h3>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Recent Clients</h5>
                    <button className="btn btn-sm btn-success" onClick={() => navigate("/coach/clients")}>
                      View All Clients
                    </button>
                  </div>

                  {dashboard?.recentClients?.length ? (
                    <div className="table-responsive">
                      <table className="table align-middle mb-0">
                        <thead>
                          <tr>
                            <th>Client</th>
                            <th>Goal</th>
                            <th>Plan</th>
                            <th>Active Plans</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dashboard.recentClients.map((client) => (
                            <tr key={client.id}>
                              <td>
                                <div className="fw-semibold">{client.fullName}</div>
                                <small className="text-muted">{client.email}</small>
                              </td>
                              <td>{client.goal || "Not set"}</td>
                              <td>{client.subscriptionPlan || "FREE"}</td>
                              <td>{client.activePlanCount}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-muted mb-0">No clients assigned yet.</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CoachDashboard;
