// eslint-disable-next-line no-unused-vars
import { useState, useEffect, setForm} from "react";

const T = {
  forest: "#1c3829",
  sage: "#3d6b4f",
  oat: "#ede6d6",
};

export default function EditSection({ profile, onSave }) {

  const [form, setForm] = useState(profile || {});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync form when profile changes
  useEffect(() => {
    if (profile) {
      setForm(profile);
    }
  }, [profile]);

  const updateField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    const success = await onSave(form);

    setIsSubmitting(false);

    if (success) {
      alert("Health profile updated successfully!");
    } else {
      alert("Update failed. Please try again.");
    }
  };

  return (
    <div className="pf-card p-fadeUp">

      <div className="pf-section-h">
        <span>👤 Physical & Health Profile</span>
      </div>

      <form onSubmit={handleSubmit}>

        <div className="pf-grid-2">

          <div className="form-group">
            <label className="pf-label" htmlFor="name">Full Name</label>
            <input
              id="name"
              className="pf-input"
              value={form.name || ""}
              onChange={(e) => updateField("name", e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="pf-label" htmlFor="age">Age</label>
            <input
              id="age"
              className="pf-input"
              type="number"
              min="10"
              max="100"
              value={form.age || ""}
              onChange={(e) => updateField("age", Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label className="pf-label" htmlFor="gender">Gender</label>
            <select
              id="gender"
              className="pf-input pf-select"
              value={form.gender || "male"}
              onChange={(e) => updateField("gender", e.target.value)}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="pf-label" htmlFor="diet">Dietary Preference</label>
            <select
              id="diet"
              className="pf-input pf-select"
              value={form.dietary || "veg"}
              onChange={(e) => updateField("dietary", e.target.value)}
            >
              <option value="veg">Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="non-veg">Non-Veg</option>
            </select>
          </div>

        </div>

        {/* Sliders */}

        <div className="pf-slider-grid">

          <div className="slider-group">
            <label className="pf-label">
              Weight: <strong>{form.weight}</strong> kg
            </label>

            <input
              type="range"
              min="30"
              max="150"
              value={form.weight || 60}
              onChange={(e) => updateField("weight", Number(e.target.value))}
              className="pf-slider"
            />
          </div>

          <div className="slider-group">
            <label className="pf-label">
              Height: <strong>{form.height}</strong> cm
            </label>

            <input
              type="range"
              min="120"
              max="220"
              value={form.height || 160}
              onChange={(e) => updateField("height", Number(e.target.value))}
              className="pf-slider"
            />
          </div>

        </div>

        <div className="pf-submit">

          <button
            type="submit"
            className="pf-btn pf-btn-primary pf-btn-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating Database..." : "💾 Save Changes"}
          </button>

        </div>

      </form>

    </div>
  );
}