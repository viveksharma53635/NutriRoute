import React from 'react'

function Toggle({ checked, onChange }) {
  return (
    <label className="pf-toggle">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className="pf-toggle-slider" />
    </label>
  );
}

export default Toggle