import React, { useEffect, useState } from "react";
import api, { authService } from "../../services/apiService";
import "bootstrap/dist/css/bootstrap.min.css";

const defaultFormData = {
  fullName: "",
  email: "",
  password: "",
  age: "",
  gender: "",
  profession: "",
  goal: "",
  heightCm: "",
  weightKg: "",
  role: "ROLE_USER",
};

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      let url = `/api/admin/users?page=${currentPage}&size=10`;
      if (searchTerm) {
        url += `&search=${encodeURIComponent(searchTerm)}`;
      }
      if (roleFilter !== "all") {
        url += `&role=${encodeURIComponent(roleFilter)}`;
      }

      const response = await api.get(url);
      setUsers(response.data.users || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (requestError) {
      console.error("Error fetching users:", requestError);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      await authService.deleteAdminUser(userId);
      fetchUsers();
    } catch (requestError) {
      console.error("Error deleting user:", requestError);
      setError("Failed to delete user");
    }
  };

  const handleSaveUser = async (userData) => {
    try {
      const payload = {
        fullName: userData.fullName.trim(),
        email: userData.email.trim(),
        password: userData.password,
        age: userData.age ? Number(userData.age) : null,
        gender: userData.gender || null,
        profession: userData.profession || null,
        goal: userData.goal || null,
        heightCm: userData.heightCm ? Number(userData.heightCm) : null,
        weightKg: userData.weightKg ? Number(userData.weightKg) : null,
        role: {
          roleName: userData.role,
        },
      };

      if (selectedUser) {
        if (!payload.password) {
          delete payload.password;
        }
        await authService.updateAdminUser(selectedUser.id, payload);
      } else {
        await authService.createAdminUser(payload);
      }

      setShowEditModal(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (requestError) {
      console.error("Error saving user:", requestError);
      setError(requestError.response?.data?.message || "Failed to save user");
    }
  };

  if (loading && users.length === 0) {
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
              <h1 className="h3 mb-1">Manage Users</h1>
              <p className="text-muted mb-0">View and manage all registered users</p>
            </div>
            <button className="btn btn-primary" onClick={() => {
              setSelectedUser(null);
              setShowEditModal(true);
            }}>
              <i className="bi bi-person-plus me-2"></i>
              Add New User
            </button>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setCurrentPage(0);
            }}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={roleFilter}
            onChange={(event) => {
              setRoleFilter(event.target.value);
              setCurrentPage(0);
            }}
          >
            <option value="all">All Roles</option>
            <option value="ROLE_USER">Users</option>
            <option value="ROLE_ADMIN">Admins</option>
          </select>
        </div>
        <div className="col-md-3">
          <button className="btn btn-outline-secondary w-100" onClick={fetchUsers}>
            <i className="bi bi-arrow-clockwise me-2"></i>
            Refresh
          </button>
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
                      <th>Email</th>
                      <th>Role</th>
                      <th>Age</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.fullName}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`badge bg-${user.role?.roleName === "ROLE_ADMIN" ? "danger" : "primary"}`}>
                            {user.role?.roleName === "ROLE_ADMIN" ? "Admin" : "User"}
                          </span>
                        </td>
                        <td>{user.age || "-"}</td>
                        <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button className="btn btn-outline-primary" onClick={() => handleEditUser(user)}>
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button className="btn btn-outline-danger" onClick={() => handleDeleteUser(user.id)}>
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center text-muted py-4">
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <nav className="mt-3">
                  <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 0 ? "disabled" : ""}`}>
                      <button className="page-link" onClick={() => setCurrentPage((page) => Math.max(page - 1, 0))}>
                        Previous
                      </button>
                    </li>
                    {[...Array(totalPages)].map((_, index) => (
                      <li key={index} className={`page-item ${currentPage === index ? "active" : ""}`}>
                        <button className="page-link" onClick={() => setCurrentPage(index)}>
                          {index + 1}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage >= totalPages - 1 ? "disabled" : ""}`}>
                      <button className="page-link" onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages - 1))}>
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </div>
          </div>
        </div>
      </div>

      {showEditModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedUser ? "Edit User" : "Add New User"}</h5>
                <button type="button" className="btn-close" onClick={() => {
                  setShowEditModal(false);
                  setSelectedUser(null);
                }}></button>
              </div>
              <div className="modal-body">
                <EditUserForm
                  user={selectedUser}
                  onSave={handleSaveUser}
                  onCancel={() => {
                    setShowEditModal(false);
                    setSelectedUser(null);
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

const EditUserForm = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    ...defaultFormData,
    fullName: user?.fullName || "",
    email: user?.email || "",
    age: user?.age || "",
    gender: user?.gender || "",
    profession: user?.profession || "",
    goal: user?.goal || "",
    heightCm: user?.heightCm || "",
    weightKg: user?.weightKg || "",
    role: user?.role?.roleName || "ROLE_USER",
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Full Name</label>
        <input type="text" className="form-control" name="fullName" value={formData.fullName} onChange={handleChange} required />
      </div>
      <div className="mb-3">
        <label className="form-label">Email</label>
        <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required disabled={!!user} />
      </div>
      <div className="mb-3">
        <label className="form-label">{user ? "New Password (optional)" : "Password"}</label>
        <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required={!user} />
      </div>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Role</label>
          <select className="form-select" name="role" value={formData.role} onChange={handleChange}>
            <option value="ROLE_USER">User</option>
            <option value="ROLE_ADMIN">Admin</option>
          </select>
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Age</label>
          <input type="number" className="form-control" name="age" value={formData.age} onChange={handleChange} required />
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Gender</label>
          <input type="text" className="form-control" name="gender" value={formData.gender} onChange={handleChange} />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Profession</label>
          <input type="text" className="form-control" name="profession" value={formData.profession} onChange={handleChange} />
        </div>
      </div>
      <div className="mb-3">
        <label className="form-label">Goal</label>
        <input type="text" className="form-control" name="goal" value={formData.goal} onChange={handleChange} />
      </div>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Height (cm)</label>
          <input type="number" className="form-control" name="heightCm" value={formData.heightCm} onChange={handleChange} />
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Weight (kg)</label>
          <input type="number" className="form-control" name="weightKg" value={formData.weightKg} onChange={handleChange} />
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {user ? "Update" : "Create"} User
        </button>
      </div>
    </form>
  );
};

export default ManageUsers;
