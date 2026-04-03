import React, { useState } from "react";

function AddMealForm({ onAdd }) {

  const [name, setName] = useState("");
  const [cal, setCal] = useState("");

  const submit = () => {

    onAdd({
      name,
      emoji: "🍽️",
      cal: Number(cal),
      tag: "veg"
    });

    setName("");
    setCal("");
  };

  return (
    <div>

      <input
        placeholder="Meal name"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <input
        placeholder="Calories"
        value={cal}
        onChange={e => setCal(e.target.value)}
      />

  <button onClick={submit}>
    Add Meal
  </button>

</div>
  );
}

export default AddMealForm;