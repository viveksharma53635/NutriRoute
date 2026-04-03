import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/apiService";
import { LoginContext } from "../context/LoginContext";

import OverviewSection from "../Profile/sections/OverviewSection";
import EditSection from "../Profile/sections/EditSection";
import HistorySection from "../Profile/sections/HistorySection";
import SettingsSection from "../Profile/sections/SettingsSection";

import "../styles/profile.css";

export default function ProfilePage() {
  const { logout } = useContext(LoginContext);
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);

  const TABS = [
    { id: "overview", label: "Overview", icon: "🏠" },
    { id: "edit", label: "Edit Profile", icon: "✏️" },
    { id: "history", label: "History", icon: "📋" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  const demoProfile = {
    id: 1,
    name: "Your Name",
    email: "Yourname@nutriroute.com",
    age: 22,
    weight: 70,
    height: 175,
    gender: "male",
    dietary: "veg",
    activity: "moderate",
    goal: "muscle_gain"
  };

  const normalizeProfile = (data) => ({
    ...demoProfile,
    ...data,
    name: data?.name || data?.fullName || demoProfile.name,
    weight: data?.weight ?? data?.weightKg ?? demoProfile.weight,
    height: data?.height ?? data?.heightCm ?? demoProfile.height
  });

  useEffect(() => {
    authService
      .getUserProfile()
      .then((res) => {
        setProfile(normalizeProfile(res?.data || {}));
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Using demo data:", err?.message || err);
        setProfile(demoProfile);
        setLoading(false);
      });
  }, []);

  const handleEditClick = () => {
    setActiveTab("edit");
  };

  const handleProfileUpdate = async (updatedData) => {

    try {
      const { data } = await authService.updateUserProfile(updatedData);
      setProfile(normalizeProfile(data || {}));
      setActiveTab("overview");
      return true;
    } catch (err) {
      console.error("Update failed:", err);
      return false;
    }

  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return <div className="pf-loading">Loading NutriRoute Profile...</div>;
  }

  if (error) {
    return <div className="pf-error">Error: {error}</div>;
  }

  const sectionsMap = {
    overview: (
      <OverviewSection
        profile={profile}
        onEdit={handleEditClick}
      />
    ),

    edit: (
      <EditSection
        profile={profile}
        onSave={handleProfileUpdate}
      />
    ),

    history: <HistorySection />,

    settings: <SettingsSection onLogout={handleLogout} />
  };

  return (

    <div className="profile-page container-fluid px-4 px-xl-5 py-4">

      {/* Header */}
      <div className="profile-header">
        <div className="profile-header-text">
          <h1 className="profile-title">My Profile</h1>
          <p className="profile-subtitle">
            Manage your health journey, <strong>{profile?.name}</strong>
          </p>
        </div>
      </div>

      {/* Tabs */}
      <nav className="profile-tabs">

        <ul className="tabs-list">

          {TABS.map((tab) => {

            const isActive = activeTab === tab.id;

            return (
              <li key={tab.id} className="tabs-item">

                <button
                  className={`tab-btn ${isActive ? "tab-active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="tab-icon">{tab.icon}</span>

                  <span className="tab-label">
                    {tab.label}
                  </span>

                </button>

              </li>
            );
          })}

        </ul>

      </nav>

      {/* Section Renderer */}
      <div className="profile-body">
        {sectionsMap[activeTab]}
      </div>

    </div>
  );
}
