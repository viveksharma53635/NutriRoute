import React from 'react'

function ProgressBar({ value, max, color, height = 8 }) {
  const pct = Math.min((value / (max || 1)) * 100, 100);
  return (
    <div className="pf-progress-wrap" style={{ height }}>
      <div className="pf-progress-fill" style={{ width: `${pct}%`, background: color, height: "100%", "--tw": `${pct}%` }} />
    </div>
  );
}
export default ProgressBar