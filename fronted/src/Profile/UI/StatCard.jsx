// import React from 'react';

// export default function StatCard({ icon, label, value, sub, color }) {
//   return (
//     <div className="pf-stat-card" style={{ 
//       background: 'white', 
//       padding: '20px', 
//       borderRadius: '18px', 
//       display: 'flex', 
//       flexDirection: 'column', 
//       gap: '8px',
//       boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
//     }}>
//       <div style={{ fontSize: '24px' }}>{icon}</div>
//       <div style={{ 
//         fontSize: '0.75rem', 
//         color: '#888', 
//         fontWeight: 'bold', 
//         textTransform: 'uppercase', 
//         letterSpacing: '0.05em' 
//       }}>
//         {label}
//       </div>
//       <div style={{ 
//         fontSize: '1.5rem', 
//         fontWeight: 'bold', 
//         color: color || '#1c3829', // Default to T.forest
//         lineHeight: '1' 
//       }}>
//         {value}
//       </div>
//       {sub && <div style={{ fontSize: '0.75rem', color: '#aaa' }}>{sub}</div>}
//     </div>
//   );
// }

export default function StatCard({ icon, label, value, sub }) {
  return (
    <div className="stat-card">
      <div className="icon">{icon}</div>
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      <div className="sub">{sub}</div>
    </div>
  );
}