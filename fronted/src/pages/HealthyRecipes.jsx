import React, { useMemo, useState } from "react";

const RECIPES = [
  {
    id: 1,
    name: "Grilled Chicken Salad",
    calories: 420,
    protein: 34,
    carbs: 16,
    fat: 19,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900",
    ingredients: ["200g grilled chicken", "Mixed lettuce", "Cherry tomatoes", "Olive oil", "Lemon juice"],
    steps: ["Grill chicken with light seasoning.", "Toss vegetables in bowl.", "Slice chicken and add on top.", "Drizzle oil + lemon and serve."]
  },
  {
    id: 2,
    name: "Avocado Toast",
    calories: 290,
    protein: 9,
    carbs: 28,
    fat: 16,
    image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=900",
    ingredients: ["2 whole grain bread slices", "1 ripe avocado", "Chili flakes", "Lime juice", "Salt"],
    steps: ["Toast bread slices.", "Mash avocado with lime + salt.", "Spread on toast.", "Top with chili flakes."]
  },
  {
    id: 3,
    name: "Protein Smoothie",
    calories: 340,
    protein: 30,
    carbs: 32,
    fat: 9,
    image: "https://images.unsplash.com/photo-1553530666-ba11a90e22dd?w=900",
    ingredients: ["1 banana", "1 scoop protein", "250ml milk", "Peanut butter", "Ice cubes"],
    steps: ["Add all ingredients to blender.", "Blend until smooth.", "Serve chilled."]
  },
  {
    id: 4,
    name: "Vegetable Stir Fry",
    calories: 310,
    protein: 12,
    carbs: 38,
    fat: 11,
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=900",
    ingredients: ["Broccoli", "Bell peppers", "Carrot", "Soy sauce", "Garlic"],
    steps: ["Heat pan with little oil.", "Saute garlic and vegetables.", "Add soy sauce and toss.", "Cook 5-6 minutes."]
  },
  {
    id: 5,
    name: "Quinoa Bowl",
    calories: 400,
    protein: 17,
    carbs: 52,
    fat: 13,
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=900",
    ingredients: ["1 cup cooked quinoa", "Chickpeas", "Cucumber", "Onion", "Tahini dressing"],
    steps: ["Prepare quinoa.", "Add chopped vegetables and chickpeas.", "Top with tahini dressing."]
  },
  {
    id: 6,
    name: "Fruit Yogurt Parfait",
    calories: 260,
    protein: 14,
    carbs: 34,
    fat: 7,
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=900",
    ingredients: ["Greek yogurt", "Mixed berries", "Granola", "Honey"],
    steps: ["Layer yogurt in glass.", "Add berries and granola.", "Repeat layers and drizzle honey."]
  }
];

const HealthyRecipes = () => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const recipeList = useMemo(() => RECIPES, []);

  return (
    <div className="py-4 px-3 px-md-4 bg-light-subtle min-vh-100">
      <div className="container-fluid">
        <div className="mb-4">
          <h1 className="h2 fw-bold mb-1">Healthy Recipes</h1>
          <p className="text-muted mb-0">
            Discover nutritious meals recommended for a balanced lifestyle.
          </p>
        </div>

        <div className="row g-4">
          {recipeList.map((recipe) => (
            <div className="col-12 col-md-6 col-xl-4" key={recipe.id}>
              <div className="card border-0 shadow-sm h-100">
                <img
                  src={recipe.image}
                  className="card-img-top"
                  alt={recipe.name}
                  style={{ height: "220px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{recipe.name}</h5>
                  <p className="text-muted mb-2">{recipe.calories} kcal</p>
                  <p className="small text-muted mb-3">
                    Protein: {recipe.protein}g | Carbs: {recipe.carbs}g | Fat: {recipe.fat}g
                  </p>
                  <button className="btn btn-outline-success mt-auto" onClick={() => setSelectedRecipe(recipe)}>
                    View Recipe
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedRecipe && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-lg modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{selectedRecipe.name}</h5>
                  <button type="button" className="btn-close" onClick={() => setSelectedRecipe(null)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <span className="badge text-bg-success">{selectedRecipe.calories} kcal</span>
                  </div>

                  <h6 className="fw-bold">Ingredients</h6>
                  <ul>
                    {selectedRecipe.ingredients.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>

                  <h6 className="fw-bold mt-4">Preparation Steps</h6>
                  <ol className="mb-0">
                    {selectedRecipe.steps.map((step) => (
                      <li key={step} className="mb-1">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
};

export default HealthyRecipes;
