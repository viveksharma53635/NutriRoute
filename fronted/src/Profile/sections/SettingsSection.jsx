import { useState } from "react";

export default function SettingsSection({ onLogout }) {

  const [notifications, setNotifications] = useState({
    mealReminders: true,
    weeklyReport: true,
    orderUpdates: true,
    tips: false,
    achievements: true
  });

  const [privacy, setPrivacy] = useState({
    shareProgress: false,
    anonymousData: true
  });

  const toggleNotification = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const togglePrivacy = (key) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:"24px"}}>

      {/* ACCOUNT */}
      <div className="pf-card">
        <h3>🔐 Account</h3>

        <div className="setting-item">
          <div>
            <strong>Change Password</strong>
            <p>Last changed 3 months ago</p>
          </div>
          <span>→</span>
        </div>

        <div className="setting-item">
          <div>
            <strong>Update Email</strong>
            <p>priya@example.com</p>
          </div>
          <span>→</span>
        </div>

        <div className="setting-item">
          <div>
            <strong>Phone Number</strong>
            <p>+91 98765 43210</p>
          </div>
          <span>→</span>
        </div>
      </div>

      {/* NOTIFICATIONS */}
      <div className="pf-card">
        <h3>🔔 Notifications</h3>

        {[
          {key:"mealReminders",label:"Meal Reminders",desc:"Get reminded to log meals"},
          {key:"weeklyReport",label:"Weekly Report",desc:"Receive summary every Monday"},
          {key:"orderUpdates",label:"Order Updates",desc:"Updates about food orders"},
          {key:"tips",label:"Nutrition Tips",desc:"Daily health tips"},
          {key:"achievements",label:"Achievement Alerts",desc:"When you unlock badges"}
        ].map(item => (

          <div className="toggle-row" key={item.key}>
            <div>
              <strong>{item.label}</strong>
              <p>{item.desc}</p>
            </div>

            <label className="switch">
              <input
                type="checkbox"
                checked={notifications[item.key]}
                onChange={()=>toggleNotification(item.key)}
              />
              <span className="slider"/>
            </label>

          </div>
        ))}

      </div>

      {/* PRIVACY */}
      <div className="pf-card">
        <h3>🔒 Privacy</h3>

        <div className="toggle-row">
          <div>
            <strong>Share Progress Publicly</strong>
            <p>Allow others to see your journey</p>
          </div>

          <label className="switch">
            <input
              type="checkbox"
              checked={privacy.shareProgress}
              onChange={()=>togglePrivacy("shareProgress")}
            />
            <span className="slider"/>
          </label>
        </div>

        <div className="toggle-row">
          <div>
            <strong>Anonymous Analytics</strong>
            <p>Help improve NutriRoute</p>
          </div>

          <label className="switch">
            <input
              type="checkbox"
              checked={privacy.anonymousData}
              onChange={()=>togglePrivacy("anonymousData")}
            />
            <span className="slider"/>
          </label>
        </div>

        <div className="privacy-info">
          🛡 Your personal health data is encrypted and never sold.
        </div>

      </div>

      {/* APP INFO */}
      <div className="pf-card">
        <h3>ℹ️ App Info</h3>

        <div className="info-row">
          <span>Version</span>
          <strong>1.0.0</strong>
        </div>

        <div className="info-row">
          <span>Build</span>
          <strong>2025-03</strong>
        </div>

        <div className="links">
          <button>Privacy Policy</button>
          <button>Terms of Service</button>
          <button>Help & Support</button>
        </div>
      </div>

      {/* DANGER ZONE */}
      <div className="pf-card danger">
        <h3 style={{color:"#e05252"}}>⚠ Danger Zone</h3>

        <div className="danger-row">
          <div>
            <strong>Sign Out</strong>
            <p>Log out from this device</p>
          </div>

          <button className="btn-outline" onClick={onLogout}>
            Sign Out
          </button>
        </div>

        <div className="danger-row">
          <div>
            <strong>Delete Account</strong>
            <p>Permanently delete all your data</p>
          </div>

          <button className="btn-danger">
            Delete Account
          </button>
        </div>
      </div>

    </div>
  );
}