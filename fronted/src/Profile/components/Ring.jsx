import React from 'react'

function Ring({ value, max, color, size = 90, stroke = 9 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value / (max || 1), 1);
  const offset = circ - pct * circ;
  const cx = size / 2, cy = size / 2;
  return (
    <svg width={size} height={size} className="pf-ring-svg">
      <circle className="pf-ring-track" cx={cx} cy={cy} r={r} strokeWidth={stroke} />
      <circle
        className="pf-ring-fill"
        cx={cx} cy={cy} r={r}
        strokeWidth={stroke}
        stroke={color}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{ "--dash-total": circ, "--dash-offset": offset, transition: "stroke-dashoffset 1.4s ease" }}
      />
    </svg>
  );
}


export default Ring