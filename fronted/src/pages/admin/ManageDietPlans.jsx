import React, { useEffect, useState } from "react";
import { authService } from "../../services/apiService";
import "bootstrap/dist/css/bootstrap.min.css";

const defaultFormData = {
  name: "",
  description: "",
  type: "BALANCED",
  durationDays: "",
  targetCaloriesPerDay: "",
  targetProteinPerDay: "",
  targetCarbsPerDay: "",
  targetFatPerDay: "",
  active: true,
};

const ManageDietPlans = () => {
  const [dietPlans, setDietPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedDietPlan, setSelectedDietPlan] = useState(null);

  useEffect(() => {
    fetchDietPlans();
  }, []);

  const fetchDietPlans = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await authService.getAdminDietPlans();
      setDietPlans(Array.isArray(response.data) ? response.data : response.data.dietPlans || []);
    } catch (requestError) {
      console.error("Error fetching diet plans:", requestError);
      const status = requestError.response?.status;
      const serverMessage = requestError.response?.data?.message || requestError.response?.data?.error;
      if (status === 401) {
        setError("Failed to load diet plans: unauthorized. Please log in again.");
      } else if (status === 403) {
        setError("Failed to load diet plans: admin access is required.");
      } else {
        setError(`Failed to load diet plans${serverMessage ? `: ${serverMessage}` : ""}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDietPlan = async (dietPlanData) => {
    try {
      const payload = {
        ...dietPlanData,
        durationDays: Number(dietPlanData.durationDays),
        targetCaloriesPerDay: Number(dietPlanData.targetCaloriesPerDay),
        targetProteinPerDay: Number(dietPlanData.targetProteinPerDay),
        targetCarbsPerDay: Number(dietPlanData.targetCarbsPerDay),
        targetFatPerDay: Number(dietPlanData.targetFatPerDay),
      };

      if (selectedDietPlan) {
        await authService.updateAdminDietPlan(selectedDietPlan.id, payload);
      } else {
        await authService.createAdminDietPlan(payload);
      }

      setShowModal(false);
      setSelectedDietPlan(null);
      fetchDietPlans();
    } catch (requestError) {
      console.error("Error saving diet plan:", requestError);
      setError("Failed to save diet plan");
    }
  };

  const handleDeleteDietPlan = async (dietPlanId) => {
    if (!window.confirm("Are you sure you want to delete this diet plan?")) {
      return;
    }

    try {
      await authService.deleteAdminDietPlan(dietPlanId);
      fetchDietPlans();
    } catch (requestError) {
      console.error("Error deleting diet plan:", requestError);
      setError("Failed to delete diet plan");
    }
  };

  if (loading && dietPlans.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
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
              <h1 className="h3 mb-1">Manage Diet Plans</h1>
              <p className="text-muted mb-0">Create and update reusable diet plan templates</p>
            </div>
            <button className="btn btn-info" onClick={() => {
              setSelectedDietPlan(null);
              setShowModal(true);
            }}>
              <i className="bi bi-plus-circle me-2"></i>
              Add New Diet Plan
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="alert alert-danger" role="alert">
              {error}
              <button type="button" className="btn-close float-end" onClick={() => setError("")}></button>
            </div>
          </div>
        </div>
      )}

      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Duration</th>
                      <th>Calories</th>
                      <th>Protein</th>
                      <th>Carbs</th>
                      <th>Fat</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dietPlans.map((dietPlan) => (
                      <tr key={dietPlan.id}>
                        <td>
                          <div>
                            <strong>{dietPlan.name}</strong>
                            {dietPlan.description && (
                              <small className="text-muted d-block">{dietPlan.description}</small>
                            )}
                          </div>
                        </td>
                        <td>{dietPlan.type}</td>
                        <td>{dietPlan.durationDays} days</td>
                        <td>{dietPlan.targetCaloriesPerDay}</td>
                        <td>{dietPlan.targetProteinPerDay}g</td>
                        <td>{dietPlan.targetCarbsPerDay}g</td>
                        <td>{dietPlan.targetFatPerDay}g</td>
                        <td>
                          <span className={`badge bg-${dietPlan.active ? "success" : "secondary"}`}>
                            {dietPlan.active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button className="btn btn-outline-primary" onClick={() => {
                              setSelectedDietPlan(dietPlan);
                              setShowModal(true);
                            }}>
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button className="btn btn-outline-danger" onClick={() => handleDeleteDietPlan(dietPlan.id)}>
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {dietPlans.length === 0 && (
                      <tr>
                        <td colSpan="9" className="text-center text-muted py-4">
                          No diet plans found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedDietPlan ? "Edit Diet Plan" : "Add New Diet Plan"}</h5>
                <button type="button" className="btn-close" onClick={() => {
                  setShowModal(false);
                  setSelectedDietPlan(null);
                }}></button>
              </div>
              <div className="modal-body">
                <DietPlanForm
                  dietPlan={selectedDietPlan}
                  onSave={handleSaveDietPlan}
                  onCancel={() => {
                    setShowModal(false);
                    setSelectedDietPlan(null);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DietPlanForm = ({ dietPlan, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    ...defaultFormData,
    ...dietPlan,
    durationDays: dietPlan?.durationDays || "",
    targetCaloriesPerDay: dietPlan?.targetCaloriesPerDay || "",
    targetProteinPerDay: dietPlan?.targetProteinPerDay || "",
    targetCarbsPerDay: dietPlan?.targetCarbsPerDay || "",
    targetFatPerDay: dietPlan?.targetFatPerDay || "",
    active: dietPlan?.active ?? true,
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.type === "checkbox" ? event.target.checked : event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Plan Name *</label>
          <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Plan Type *</label>
          <select className="form-select" name="type" value={formData.type} onChange={handleChange} required>
            <option value="BALANCED">Balanced</option>
            <option value="WEIGHT_LOSS">Weight Loss</option>
            <option value="MUSCLE_GAIN">Muscle Gain</option>
            <option value="KETO">Keto</option>
          </select>
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} rows="2" />
      </div>
      <div className="row">
        <div className="col-md-3 mb-3">
          <label className="form-label">Duration *</label>
          <input type="number" className="form-control" name="durationDays" value={formData.durationDays} onChange={handleChange} required />
        </div>
        <div className="col-md-3 mb-3">
          <label className="form-label">Calories *</label>
          <input type="number" className="form-control" name="targetCaloriesPerDay" value={formData.targetCaloriesPerDay} onChange={handleChange} required />
        </div>
        <div className="col-md-3 mb-3">
          <label className="form-label">Protein *</label>
          <input type="number" step="0.1" className="form-control" name="targetProteinPerDay" value={formData.targetProteinPerDay} onChange={handleChange} required />
        </div>
        <div className="col-md-3 mb-3">
          <label className="form-label">Carbs *</label>
          <input type="number" step="0.1" className="form-control" name="targetCarbsPerDay" value={formData.targetCarbsPerDay} onChange={handleChange} required />
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Fat *</label>
          <input type="number" step="0.1" className="form-control" name="targetFatPerDay" value={formData.targetFatPerDay} onChange={handleChange} required />
        </div>
        <div className="col-md-6 mb-3 d-flex align-items-end">
          <div className="form-check mb-2">
            <input type="checkbox" className="form-check-input" name="active" checked={formData.active} onChange={handleChange} />
            <label className="form-check-label ms-2">Active</label>
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-info">
          {dietPlan ? "Update" : "Create"} Diet Plan
        </button>
      </div>
    </form>
  );
};

export default ManageDietPlans;
