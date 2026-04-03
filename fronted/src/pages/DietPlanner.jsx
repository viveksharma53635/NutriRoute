import React, { useMemo, useState } from "react";
import "./DietPlanner.css";

const GOALS = ["Weight Loss", "Muscle Gain", "Maintain Weight", "Balanced Diet"];

const GOAL_MEALS = {
  "Weight Loss": {
    breakfast: ["Overnight oats with chia", "Boiled eggs + cucumber", "Green tea"],
    lunch: ["Brown rice + dal", "Grilled paneer salad", "Buttermilk"],
    dinner: ["Vegetable soup", "Sauteed tofu + veggies", "1 multigrain roti"],
    snacks: ["Roasted chana", "Apple slices", "Greek yogurt"]
  },
  "Muscle Gain": {
    breakfast: ["Peanut butter toast", "Banana protein smoothie", "3 egg omelette"],
    lunch: ["Chicken + rice bowl", "Dal + paneer", "Curd"],
    dinner: ["Fish curry + rice", "Quinoa + chickpeas", "Mixed veggies"],
    snacks: ["Trail mix", "Whey shake", "Peanut chikki"]
  },
  "Maintain Weight": {
    breakfast: ["Oatmeal with fruits", "Egg sandwich", "Milk"],
    lunch: ["Rice + dal + sabzi", "Chicken wrap", "Salad"],
    dinner: ["Khichdi + curd", "Grilled chicken + veggies", "Fruit"],
    snacks: ["Nuts", "Fruit yogurt", "Corn chaat"]
  },
  "Balanced Diet": {
    breakfast: ["Poha + sprouts", "Protein smoothie", "Seasonal fruit"],
    lunch: ["Roti + dal + sabzi", "Quinoa bowl", "Curd"],
    dinner: ["Soup + salad", "Paneer stir fry", "Millet roti"],
    snacks: ["Makhanas", "Fruit bowl", "Buttermilk"]
  }
};

const WEEKLY_PLAN = [
  { day: "Monday", breakfast: "Oats", lunch: "Rice + Dal", dinner: "Salad + Chicken" },
  { day: "Tuesday", breakfast: "Poha", lunch: "Roti + Paneer", dinner: "Soup + Tofu" },
  { day: "Wednesday", breakfast: "Egg Sandwich", lunch: "Quinoa Bowl", dinner: "Fish + Veggies" },
  { day: "Thursday", breakfast: "Upma", lunch: "Rice + Rajma", dinner: "Grilled Paneer" },
  { day: "Friday", breakfast: "Smoothie Bowl", lunch: "Chicken Wrap", dinner: "Dal + Roti" },
  { day: "Saturday", breakfast: "Idli Sambar", lunch: "Millet Khichdi", dinner: "Veg Stir Fry" },
  { day: "Sunday", breakfast: "Avocado Toast", lunch: "Biryani + Raita", dinner: "Light Salad" }
];

const CALORIES = {
  breakfast: "350 - 450 kcal",
  lunch: "500 - 650 kcal",
  dinner: "450 - 600 kcal",
  snacks: "150 - 250 kcal"
};

const DietPlanner = () => {
  const [goal, setGoal] = useState("Balanced Diet");
  const [showAiCard, setShowAiCard] = useState(false);

  const meals = useMemo(() => GOAL_MEALS[goal], [goal]);

  const mealCards = [
    { key: "breakfast", title: "Breakfast", icon: "bi-sunrise" },
    { key: "lunch", title: "Lunch", icon: "bi-sun" },
    { key: "dinner", title: "Dinner", icon: "bi-moon-stars" },
    { key: "snacks", title: "Snacks", icon: "bi-cup-straw" }
  ];

  return (
    <div className="diet-planner-page py-4 px-3 px-md-4">
      <div className="container-fluid">
        <div className="mb-4">
          <h1 className="h2 fw-bold mb-1">Diet Planner</h1>
          <p className="text-muted mb-0">Plan your daily meals based on your health goals.</p>
        </div>

        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <label className="form-label fw-semibold">Goal Selection</label>
            <select className="form-select planner-select" value={goal} onChange={(e) => setGoal(e.target.value)}>
              {GOALS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="row g-3 mb-4">
          {mealCards.map((card) => (
            <div className="col-12 col-md-6 col-xl-3" key={card.key}>
              <div className="card border-0 shadow-sm h-100 meal-plan-card">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <span className="meal-icon me-2">
                      <i className={`bi ${card.icon}`}></i>
                    </span>
                    <h5 className="mb-0">{card.title}</h5>
                  </div>
                  <ul className="ps-3 mb-3">
                    {(meals[card.key] || []).map((meal) => (
                      <li key={meal} className="small mb-1">
                        {meal}
                      </li>
                    ))}
                  </ul>
                  <span className="badge text-bg-light border">{CALORIES[card.key]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <h4 className="h5 fw-bold mb-3">Weekly Diet Plan</h4>
            <div className="table-responsive">
              <table className="table table-striped align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Day</th>
                    <th>Breakfast</th>
                    <th>Lunch</th>
                    <th>Dinner</th>
                  </tr>
                </thead>
                <tbody>
                  {WEEKLY_PLAN.map((item) => (
                    <tr key={item.day}>
                      <td className="fw-semibold">{item.day}</td>
                      <td>{item.breakfast}</td>
                      <td>{item.lunch}</td>
                      <td>{item.dinner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <h4 className="h5 fw-bold mb-3">AI Diet Suggestion</h4>
            <button className="btn btn-success" onClick={() => setShowAiCard(true)}>
              Generate AI Diet Plan
            </button>

            {showAiCard && (
              <div className="alert alert-info mt-3 mb-0">
                Based on your nutrition goals, NutriRoute will generate a personalized diet plan.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DietPlanner;
