import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CoachSidebar from "../components/CoachSidebar";
import { authService } from "../services/apiService";
import { LoginContext } from "../context/LoginContext";

function CoachClientsPage() {
  const { isCoach } = useContext(LoginContext);
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isCoach()) {
      navigate("/login");
      return;
    }

    const loadClients = async () => {
      try {
        const response = await authService.getCoachClients();
        const clientList = response.data || [];
        setClients(clientList);
        if (clientList.length > 0) {
          const detailResponse = await authService.getCoachClientDetails(clientList[0].id);
          setSelectedClient(detailResponse.data);
        }
      } catch (error) {
        console.error("Failed to load coach clients", error);
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, [isCoach, navigate]);

  const showClient = async (clientId) => {
    try {
      const response = await authService.getCoachClientDetails(clientId);
      setSelectedClient(response.data);
    } catch (error) {
      console.error("Failed to load client details", error);
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
              <p className="text-uppercase text-muted small mb-1">Clients</p>
              <h2 className="mb-0">Assigned Client List</h2>
            </div>
          </div>

          {loading ? (
            <div className="d-flex justify-content-center py-5">
              <div className="spinner-border text-success" role="status" />
            </div>
          ) : (
            <div className="row g-4">
              <div className="col-lg-5">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <h5 className="mb-3">Clients</h5>
                    {clients.length ? (
                      <div className="list-group list-group-flush">
                        {clients.map((client) => (
                          <button
                            key={client.id}
                            type="button"
                            className={`list-group-item list-group-item-action border rounded-3 mb-2 ${selectedClient?.id === client.id ? "active bg-success border-success" : ""}`}
                            onClick={() => showClient(client.id)}
                          >
                            <div className="fw-semibold">{client.fullName}</div>
                            <small className={selectedClient?.id === client.id ? "text-white" : "text-muted"}>
                              {client.email}
                            </small>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted mb-0">No clients assigned to this coach yet.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-lg-7">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <h5 className="mb-3">Client Details</h5>
                    {selectedClient ? (
                      <div className="row g-3">
                        <div className="col-md-6"><strong>Name:</strong><div>{selectedClient.fullName}</div></div>
                        <div className="col-md-6"><strong>Email:</strong><div>{selectedClient.email}</div></div>
                        <div className="col-md-6"><strong>Age:</strong><div>{selectedClient.age || "N/A"}</div></div>
                        <div className="col-md-6"><strong>Gender:</strong><div>{selectedClient.gender || "N/A"}</div></div>
                        <div className="col-md-6"><strong>Weight:</strong><div>{selectedClient.weightKg || "N/A"} kg</div></div>
                        <div className="col-md-6"><strong>Height:</strong><div>{selectedClient.heightCm || "N/A"} cm</div></div>
                        <div className="col-md-6"><strong>Profession:</strong><div>{selectedClient.profession || "N/A"}</div></div>
                        <div className="col-md-6"><strong>Subscription:</strong><div>{selectedClient.subscriptionPlan || "FREE"}</div></div>
                        <div className="col-12"><strong>Goal:</strong><div>{selectedClient.goal || "No goal set"}</div></div>
                        <div className="col-12"><strong>Active Assigned Plans:</strong><div>{selectedClient.activePlanCount}</div></div>
                      </div>
                    ) : (
                      <p className="text-muted mb-0">Select a client to view detailed profile information.</p>
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

export default CoachClientsPage;
