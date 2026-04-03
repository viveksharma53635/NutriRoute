// eslint-disable-next-line no-unused-vars
import { useState, useEffect } from "react";

// Design Tokens
const T = {
  forest: "#1c3829",
  terra: "#c86b42",
  mint: "#5a9e72",
  oat: "#ede6d6",
};

export default function HistorySection() {
  const [mealHistory, setMealHistory] = useState(() => {
    const storedMeals = localStorage.getItem("nutri_meals");
    return storedMeals ? JSON.parse(storedMeals) : [];
  });

  // Calculate total calories for the current log
  const totalCalories = mealHistory.reduce((sum, meal) => sum + (Number(meal.cal) || 0), 0);

  const addMeal = (meal) => {
    const newMeal = { 
      id: Date.now(), 
      date: new Date().toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }),
      ...meal 
    };
    const updated = [newMeal, ...mealHistory];
    setMealHistory(updated);
    localStorage.setItem("nutri_meals", JSON.stringify(updated));
  };

  const clearHistory = () => {
    if (window.confirm("Clear all meal logs?")) {
      setMealHistory([]);
      localStorage.removeItem("nutri_meals");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      
      {/* ─── Summary Header ─── */}
      <div className="pf-grid-2 p-fadeUp">
        <div className="pf-card" style={{ background: T.forest, color: "white" }}>
          <div style={{ fontSize: "0.8rem", opacity: 0.8, textTransform: "uppercase" }}>Total Logged</div>
          <div style={{ fontSize: "2rem", fontWeight: "bold" }}>{totalCalories} <span style={{ fontSize: "1rem" }}>kcal</span></div>
        </div>
        <div className="pf-card" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <button className="pf-btn pf-btn-primary" onClick={() => addMeal({ name: "Green Goddess Bowl", emoji: "🥗", cal: 420 })}>
            + Quick Log Salad
          </button>
        </div>
      </div>

      {/* ─── Meal List ─── */}
      <div className="pf-card p-fadeUp d2">
        <div className="pf-section-h" style={{ justifyContent: "space-between" }}>
          <span>🗒️ Recent Meal Log</span>
          {mealHistory.length > 0 && (
            <button onClick={clearHistory} style={{ background: "none", border: "none", color: T.terra, cursor: "pointer", fontSize: "0.8rem" }}>
              Clear All
            </button>
          )}
        </div>

        <div className="pf-scroll" style={{ marginTop: "10px" }}>
          {mealHistory.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#aaa" }}>
              <div style={{ fontSize: "3rem", marginBottom: "10px" }}>🍽️</div>
              <p>No meals logged yet. Start tracking your NutriRoute!</p>
            </div>
          ) : (
            mealHistory.map((meal) => (
              <div className="pf-meal-item" key={meal.id} style={{ display: "flex", alignItems: "center", gap: "15px", padding: "12px 0", borderBottom: `1px solid ${T.oat}` }}>
                <div style={{ fontSize: "24px", background: T.oat, width: "45px", height: "45px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "12px" }}>
                  {meal.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "bold", color: T.forest }}>{meal.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "#999" }}>{meal.date}</div>
                </div>
                <div style={{ fontWeight: "bold", color: T.terra }}>
                  {meal.cal} <span style={{ fontSize: "0.7rem" }}>kcal</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ─── Educational Note ─── */}
      <div style={{ fontSize: "0.8rem", color: "#888", textAlign: "center", padding: "10px" }}>
        💡 Consistency is key. Logging your meals helps NutriRoute suggest better diet plans for you.
      </div>
    </div>
  );
}