import React from 'react' 
import T from '../hooks/theme'

function StatCard({ icon, label, value, sub, color, bg }) {
  return (
    <div className="pf-stat-card" style={{ background: bg || T.oat }}>
    
      <div style={{ fontSize: 22 }}>{icon}</div>
      <div style={{ fontSize: "0.75rem", color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</div>
      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.65rem", fontWeight: 700, color: color || T.forest, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: "0.75rem", color: "#aaa" }}>{sub}</div>}
    </div>
  );
}

export default StatCard