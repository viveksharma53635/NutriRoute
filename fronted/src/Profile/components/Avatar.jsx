import React from 'react'

function Avatar({ name, size = 80 }) {
  const initials = name
    ? name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : "U";
  return (
    <div className="pf-avatar" style={{ width: size, height: size, fontSize: size * 0.36 }}>
      {initials}
      <div className="pf-avatar-edit">✏️</div>
    </div>
  );
}

export default Avatar