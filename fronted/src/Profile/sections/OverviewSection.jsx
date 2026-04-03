import React from "react";
import "../../styles/profile.css";

export default function OverviewSection({ profile, onEdit }) {



  const bmi = (profile.weight / ((profile.height / 100) ** 2)).toFixed(1);

  const stats = [
    { icon: "🧬", label: "BMI", value: bmi, sub: "Normal" },
    { icon: "🔥", label: "TDEE", value: "2494", sub: "kcal / day" },
    { icon: "🎯", label: "CAL TARGET", value: "1994", sub: "-500 offset" },
    { icon: "📅", label: "MEMBER SINCE", value: "Mar '25", sub: "Active user" }
  ];

  const macros = [
    { icon: "💪", label: "Protein", value: "174g" },
    { icon: "⚡", label: "Carbs", value: "199g" },
    { icon: "🥑", label: "Fat", value: "55g" }
  ];

  const achievements = [
    { icon: "🔥", title: "7-Day Streak", desc: "Logged meals 7 days in a row", earned: true },
    { icon: "💪", title: "Protein King", desc: "Hit protein goal 5 days this week", earned: true },
    { icon: "🥗", title: "Veggie Lover", desc: "Ordered 10+ vegetarian meals", earned: true },
    { icon: "💧", title: "Hydration Hero", desc: "Drink 8 glasses 7 days straight", earned: false },
    { icon: "⚖️", title: "Macro Master", desc: "Hit all macros in one day", earned: false },
    { icon: "🏆", title: "Goal Crusher", desc: "Reach your goal weight", earned: false }
  ];

  return (
    <div className="overview-container">

      {/* Profile Hero */}
      <div className="profile-hero">

        <div className="avatar">
          {profile.name.charAt(0)}
        </div>

        <div className="profile-info">
          <h2>{profile.name && ` - ${profile.name}`}</h2>

          <div className="profile-meta">
            <span>👤 {profile.age}y · {profile.gender}</span>
            <span>📏 {profile.height} cm</span>
            <span>⚖️ {profile.weight} kg</span>
            <span>🏃 Moderately Active</span>
          </div>

          <div className="profile-badges">
            <span className="badge">🔥 Fat Loss</span>
            <span className="badge">🔥 7-day streak</span>
          </div>
        </div>

        <div className="overview-section">

      <h2>Profile Overview</h2>

      <p><strong>Name:</strong> {profile.name}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Height:</strong> {profile.height}</p>
      <p><strong>Weight:</strong> {profile.weight}</p>

      <button
        className="edit-btn"
        onClick={onEdit}
      >
        Edit Profile
      </button>

    </div>

      </div>


      {/* Stats */}
      <div className="stats-grid">
        {stats.map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="icon">{s.icon}</div>
            <div className="label">{s.label}</div>
            <div className="value">{s.value}</div>
            <div className="sub">{s.sub}</div>
          </div>
        ))}
      </div>


      {/* BMI + Macros */}
      <div className="analysis-grid">

        <div className="card">
          <h3>🧬 BMI Analysis</h3>

          <div className="bmi-box">
            <div className="bmi-circle">
              <span>{bmi}</span>
            </div>

            <div className="bmi-info">
              <span className="badge green">Normal</span>
              <p>
                Great! Maintain your healthy lifestyle and balanced diet.
              </p>
            </div>
          </div>

        </div>


        <div className="card">
          <h3>🎯 Daily Macro Targets</h3>

          <div className="macro-grid">
            {macros.map((m, i) => (
              <div className="macro-card" key={i}>
                <div className="icon">{m.icon}</div>
                <div className="value">{m.value}</div>
                <div className="label">{m.label}</div>
              </div>
            ))}
          </div>

          <div className="macro-note">
            💡 Based on your Fat Loss goal and 1994 kcal daily target.
          </div>

        </div>

      </div>


      {/* Achievements */}
      <div className="card">

        <div className="ach-header">
          <h3>🏆 Achievements</h3>
          <span>3 / 6 earned</span>
        </div>

        <div className="ach-grid">

          {achievements.map((a, i) => (

            <div
              key={i}
              className={`ach-card ${a.earned ? "earned" : "locked"}`}
            >

              <div className="icon">{a.icon}</div>

              <div>
                <div className="title">{a.title}</div>
                <div className="desc">{a.desc}</div>
              </div>

              {a.earned && <span className="check">✓</span>}

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}