import React, { useEffect, useState } from "react";
import { authService } from "../../services/apiService";

const AdminSubscriptions = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await authService.getAdminSubscriptions();
        setData(res.data?.subscriptions || []);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  if (loading) {
    return <div className="spinner-border text-primary" role="status" />;
  }

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <h4 className="mb-3">Subscriptions</h4>
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Start</th>
                <th>End</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.user?.name || "-"}</td>
                  <td>{item.plan}</td>
                  <td>{item.paymentStatus}</td>
                  <td>{item.startDate || "-"}</td>
                  <td>{item.endDate || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminSubscriptions;
