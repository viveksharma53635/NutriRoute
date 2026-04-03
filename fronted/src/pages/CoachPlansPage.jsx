import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CoachSidebar from "../components/CoachSidebar";
import { authService } from "../services/apiService";
import { LoginContext } from "../context/LoginContext";

const initialForm = {
  title: "",
  planType: "DIET",
  description: "",
  instructions: "",
  clientId: "",
  startDate: "",
  endDate: "",
  active: true
};

function CoachPlansPage() {
  const { isCoach } = useContext(LoginContext);
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isCoach()) {
      navigate("/login");
      return;
    }

    const loadData = async () => {
      try {
        const [clientsResponse, plansResponse] = await Promise.all([
          authService.getCoachClients(),
          authService.getCoachPlans()
        ]);
        setClients(clientsResponse.data || []);
        setPlans(plansResponse.data || []);
      } catch (error) {
        console.error("Failed to load coach plans", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isCoach, navigate]);

  const refreshPlans = async () => {
    const response = await authService.getCoachPlans();
    setPlans(response.data || []);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      if (editingPlanId) {
        await authService.updateCoachPlan(editingPlanId, form);
        setMessage("Plan updated successfully.");
      } else {
        await authService.createCoachPlan(form);
        setMessage("Plan created successfully.");
      }

      setForm(initialForm);
      setEditingPlanId(null);
      await refreshPlans();
    } catch (error) {
      setMessage(error?.response?.data?.message || "Failed to save the plan.");
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (plan) => {
    setEditingPlanId(plan.id);
    setForm({
      title: plan.title || "",
      planType: plan.planType || "DIET",
      description: plan.description || "",
      instructions: plan.instructions || "",
      clientId: plan.clientId || "",
      startDate: plan.startDate || "",
      endDate: plan.endDate || "",
      active: Boolean(plan.active)
    });
  };

  const handleDelete = async (planId) => {
    try {
      await authService.deleteCoachPlan(planId);
      setMessage("Plan deleted successfully.");
      if (editingPlanId === planId) {
        setEditingPlanId(null);
        setForm(initialForm);
      }
      await refreshPlans();
    } catch (error) {
      setMessage(error?.response?.data?.message || "Failed to delete the plan.");
    }
  };

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">
      <div className="row g-4">
        <div className="col-lg-3">
          <CoachSidebar />
        </div>

        <div className="col-lg-9">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <p className="text-uppercase text-muted small mb-1">Plans</p>
              <h2 className="mb-0">Plan Management</h2>
            </div>
          </div>

          {loading ? (
            <div className="d-flex justify-content-center py-5">
              <div className="spinner-border text-success" role="status" />
            </div>
          ) : (
            <div className="row g-4">
              <div className="col-xl-5">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <h5 className="mb-3">{editingPlanId ? "Update Plan" : "Create New Plan"}</h5>

                    {message && <div className="alert alert-info">{message}</div>}

                    <form onSubmit={handleSubmit} className="d-grid gap-3">
                      <div>
                        <label className="form-label">Plan Title</label>
                        <input className="form-control" name="title" value={form.title} onChange={handleChange} required />
                      </div>

                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Plan Type</label>
                          <select className="form-select" name="planType" value={form.planType} onChange={handleChange}>
                            <option value="DIET">Diet</option>
                            <option value="WORKOUT">Workout</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Assign Client</label>
                          <select className="form-select" name="clientId" value={form.clientId} onChange={handleChange} required>
                            <option value="">Select client</option>
                            {clients.map((client) => (
                              <option key={client.id} value={client.id}>
                                {client.fullName}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="form-label">Description</label>
                        <textarea className="form-control" rows="3" name="description" value={form.description} onChange={handleChange} />
                      </div>

                      <div>
                        <label className="form-label">Instructions</label>
                        <textarea className="form-control" rows="4" name="instructions" value={form.instructions} onChange={handleChange} />
                      </div>

                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Start Date</label>
                          <input className="form-control" type="date" name="startDate" value={form.startDate} onChange={handleChange} />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">End Date</label>
                          <input className="form-control" type="date" name="endDate" value={form.endDate} onChange={handleChange} />
                        </div>
                      </div>

                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="activePlan"
                          name="active"
                          checked={form.active}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="activePlan">
                          Active plan
                        </label>
                      </div>

                      <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-success" disabled={submitting}>
                          {submitting ? "Saving..." : editingPlanId ? "Update Plan" : "Create Plan"}
                        </button>
                        {editingPlanId && (
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => {
                              setEditingPlanId(null);
                              setForm(initialForm);
                              setMessage("");
                            }}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div className="col-xl-7">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <h5 className="mb-3">Assigned Plans</h5>
                    {plans.length ? (
                      <div className="table-responsive">
                        <table className="table align-middle">
                          <thead>
                            <tr>
                              <th>Title</th>
                              <th>Type</th>
                              <th>Client</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {plans.map((plan) => (
                              <tr key={plan.id}>
                                <td>
                                  <div className="fw-semibold">{plan.title}</div>
                                  <small className="text-muted">{plan.startDate || "No start date"}</small>
                                </td>
                                <td>{plan.planType}</td>
                                <td>{plan.clientName}</td>
                                <td>
                                  <span className={`badge ${plan.active ? "bg-success" : "bg-secondary"}`}>
                                    {plan.active ? "Active" : "Inactive"}
                                  </span>
                                </td>
                                <td className="d-flex gap-2">
                                  <button type="button" className="btn btn-sm btn-outline-success" onClick={() => startEdit(plan)}>
                                    Edit
                                  </button>
                                  <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(plan.id)}>
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-muted mb-0">No plans created yet for assigned clients.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CoachPlansPage;
