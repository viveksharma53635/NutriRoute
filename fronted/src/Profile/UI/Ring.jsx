import React from 'react';

export default function Ring({ value, max, color, size = 100, stroke = 10 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate percentage (clamped between 0 and 1)
  const percentage = Math.min(Math.max(value / max, 0), 1);
  const offset = circumference - percentage * circumference;

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      {/* Background Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#ede6d6" // T.oat
        strokeWidth={stroke}
        fill="transparent"
      />
      {/* Progress Fill */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={stroke}
        fill="transparent"
        strokeDasharray={circumference}
        style={{
          strokeDashoffset: offset,
          transition: 'stroke-dashoffset 1s ease-in-out',
          strokeLinecap: 'round'
        }}
      />
    </svg>
  );
}