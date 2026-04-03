import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from "axios";

const ProgressPage = () => {
  const [progressHistory, setProgressHistory] = useState([]);
  const [latestProgress, setLatestProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProgress, setNewProgress] = useState({
    weight: '',
    bmi: ''
  });
  const [addingProgress, setAddingProgress] = useState(false);

  // Fetch progress history
  const fetchProgressHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/progress/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProgressHistory(response.data);
      
      if (response.data.length > 0) {
        setLatestProgress(response.data[0]); // Most recent is first
      }
    } catch (error) {
      console.error('Error fetching progress history:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add new progress entry
  const handleAddProgress = async (e) => {
    e.preventDefault();
    
    if (!newProgress.weight) {
      alert('Please enter your weight');
      return;
    }

    try {
      setAddingProgress(true);
      const token = localStorage.getItem('token');
      const progressData = {
        weight: parseFloat(newProgress.weight),
        bmi: newProgress.bmi ? parseFloat(newProgress.bmi) : null,
        recordedAt: new Date().toISOString()
      };

      const response = await axios.post('/api/progress', progressData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setProgressHistory(prev => [response.data, ...prev]);
      setLatestProgress(response.data);
      setNewProgress({ weight: '', bmi: '' });
      setShowAddForm(false);
      alert('Progress recorded successfully!');
    } catch (error) {
      console.error('Error adding progress:', error);
      alert('Failed to record progress');
    } finally {
      setAddingProgress(false);
    }
  };

  // Delete progress entry
  const handleDeleteProgress = async (progressId) => {
    if (!window.confirm('Are you sure you want to delete this progress entry?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/progress/${progressId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setProgressHistory(prev => prev.filter(p => p.id !== progressId));
      if (latestProgress?.id === progressId) {
        setLatestProgress(progressHistory.length > 1 ? progressHistory[1] : null);
      }
      alert('Progress entry deleted successfully!');
    } catch (error) {
      console.error('Error deleting progress:', error);
      alert('Failed to delete progress entry');
    }
  };

  // Prepare chart data
  const chartData = progressHistory.slice().reverse().map((progress, index) => ({
    date: new Date(progress.recordedAt).toLocaleDateString(),
    weight: progress.weight,
    bmi: progress.bmi || 0,
    index: index + 1
  }));

  useEffect(() => {
    fetchProgressHistory();
  }, []);

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

  return (
    <div className="container-fluid bg-light py-4" style={{ minHeight: "100vh" }}>
      <div className="container">
        {/* HEADER */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="fw-bold">Progress Tracking</h2>
                <p className="text-muted">Monitor your weight and BMI over time</p>
              </div>
              <button 
                className="btn btn-primary"
                onClick={() => setShowAddForm(!showAddForm)}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Record Progress
              </button>
            </div>
          </div>
        </div>

        {/* ADD PROGRESS FORM */}
        {showAddForm && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Record New Progress</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleAddProgress}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Weight (kg)</label>
                        <input 
                          type="number" 
                          step="0.1"
                          className="form-control"
                          value={newProgress.weight}
                          onChange={(e) => setNewProgress(prev => ({ ...prev, weight: e.target.value }))}
                          placeholder="Enter your weight"
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">BMI (optional)</label>
                        <input 
                          type="number" 
                          step="0.1"
                          className="form-control"
                          value={newProgress.bmi}
                          onChange={(e) => setNewProgress(prev => ({ ...prev, bmi: e.target.value }))}
                          placeholder="Enter your BMI"
                        />
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <button 
                        type="submit" 
                        className="btn btn-primary"
                        disabled={addingProgress}
                      >
                        {addingProgress ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Recording...
                          </>
                        ) : (
                          'Record Progress'
                        )}
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-secondary"
                        onClick={() => setShowAddForm(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CURRENT STATS */}
        {latestProgress && (
          <div className="row mb-4">
            <div className="col-md-4 mb-3">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title text-primary">Current Weight</h5>
                  <h2 className="fw-bold">{latestProgress.weight} kg</h2>
                  <small className="text-muted">
                    Recorded on {new Date(latestProgress.recordedAt).toLocaleDateString()}
                  </small>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title text-success">Current BMI</h5>
                  <h2 className="fw-bold">
                    {latestProgress.bmi ? latestProgress.bmi.toFixed(1) : 'N/A'}
                  </h2>
                  <small className="text-muted">
                    {latestProgress.bmi ? (
                      latestProgress.bmi < 18.5 ? 'Underweight' :
                      latestProgress.bmi < 25 ? 'Normal' :
                      latestProgress.bmi < 30 ? 'Overweight' : 'Obese'
                    ) : 'Not calculated'}
                  </small>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title text-info">Total Records</h5>
                  <h2 className="fw-bold">{progressHistory.length}</h2>
                  <small className="text-muted">Progress entries</small>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PROGRESS CHART */}
        {progressHistory.length > 0 && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Progress Chart</h5>
                </div>
                <div className="card-body">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="weight" 
                        stroke="#8884d8" 
                        name="Weight (kg)"
                        strokeWidth={2}
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="bmi" 
                        stroke="#82ca9d" 
                        name="BMI"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PROGRESS HISTORY */}
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Progress History</h5>
              </div>
              <div className="card-body">
                {progressHistory.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted">No progress records yet</p>
                    <button 
                      className="btn btn-primary"
                      onClick={() => setShowAddForm(true)}
                    >
                      Start Tracking
                    </button>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Weight (kg)</th>
                          <th>BMI</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {progressHistory.map((progress) => (
                          <tr key={progress.id}>
                            <td>{new Date(progress.recordedAt).toLocaleDateString()}</td>
                            <td>
                              <strong>{progress.weight}</strong> kg
                            </td>
                            <td>
                              {progress.bmi ? progress.bmi.toFixed(1) : 'N/A'}
                            </td>
                            <td>
                              {progress.bmi ? (
                                <span className={`badge ${
                                  progress.bmi < 18.5 ? 'bg-warning' :
                                  progress.bmi < 25 ? 'bg-success' :
                                  progress.bmi < 30 ? 'bg-info' : 'bg-danger'
                                }`}>
                                  {progress.bmi < 18.5 ? 'Underweight' :
                                   progress.bmi < 25 ? 'Normal' :
                                   progress.bmi < 30 ? 'Overweight' : 'Obese'}
                                </span>
                              ) : (
                                <span className="badge bg-secondary">No BMI</span>
                              )}
                            </td>
                            <td>
                              <button 
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteProgress(progress.id)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
