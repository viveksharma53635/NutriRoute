import React, { useState } from 'react';

const DietPlanDisplay = ({ dietPlan, loading }) => {
  const [expandedMeal, setExpandedMeal] = useState(null);

  const getMealIcon = (mealType) => {
    switch (mealType) {
      case 'BREAKFAST':
        return 'bi-sunrise';
      case 'LUNCH':
        return 'bi-sun';
      case 'DINNER':
        return 'bi-moon';
      case 'SNACK':
        return 'bi-cup-straw';
      default:
        return 'bi-circle';
    }
  };

  const getMealColor = (mealType) => {
    switch (mealType) {
      case 'BREAKFAST':
        return 'warning';
      case 'LUNCH':
        return 'success';
      case 'DINNER':
        return 'primary';
      case 'SNACK':
        return 'info';
      default:
        return 'secondary';
    }
  };

  const toggleMealExpansion = (mealId) => {
    setExpandedMeal(expandedMeal === mealId ? null : mealId);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!dietPlan) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-egg-fried fs-1 text-muted mb-3"></i>
        <h4>No Diet Plan Yet</h4>
        <p className="text-muted">
          Generate your personalized diet plan to see meal recommendations.
        </p>
      </div>
    );
  }

  // Mock meal data for demonstration
  const mockMeals = [
    {
      id: 1,
      mealType: 'BREAKFAST',
      mealName: 'Energizing Breakfast Bowl',
      totalCalories: 450,
      totalProtein: 25.5,
      totalCarbs: 52.3,
      totalFat: 12.8,
      preparationTimeMinutes: 15,
      instructions: 'Mix oats with milk, add berries and nuts. Serve warm.',
      foodItems: [
        {
          id: 1,
          foodName: 'Rolled Oats',
          quantityGrams: 50,
          calories: 190,
          protein: 6.5,
          carbs: 32.0,
          fat: 3.5,
          category: 'CARBS'
        },
        {
          id: 2,
          foodName: 'Greek Yogurt',
          quantityGrams: 150,
          calories: 90,
          protein: 15.0,
          carbs: 6.0,
          fat: 0.5,
          category: 'PROTEIN'
        },
        {
          id: 3,
          foodName: 'Mixed Berries',
          quantityGrams: 100,
          calories: 57,
          protein: 0.7,
          carbs: 14.3,
          fat: 0.3,
          category: 'FRUITS'
        },
        {
          id: 4,
          foodName: 'Almonds',
          quantityGrams: 15,
          calories: 87,
          protein: 3.3,
          carbs: 3.0,
          fat: 7.5,
          category: 'FATS'
        }
      ]
    },
    {
      id: 2,
      mealType: 'LUNCH',
      mealName: 'Balanced Lunch Plate',
      totalCalories: 620,
      totalProtein: 38.2,
      totalCarbs: 68.5,
      totalFat: 18.7,
      preparationTimeMinutes: 25,
      instructions: 'Grill chicken and prepare quinoa salad with vegetables.',
      foodItems: [
        {
          id: 5,
          foodName: 'Grilled Chicken Breast',
          quantityGrams: 150,
          calories: 248,
          protein: 46.5,
          carbs: 0.0,
          fat: 5.4,
          category: 'PROTEIN'
        },
        {
          id: 6,
          foodName: 'Quinoa',
          quantityGrams: 100,
          calories: 120,
          protein: 4.4,
          carbs: 21.3,
          fat: 1.9,
          category: 'CARBS'
        },
        {
          id: 7,
          foodName: 'Mixed Vegetables',
          quantityGrams: 150,
          calories: 45,
          protein: 2.7,
          carbs: 9.0,
          fat: 0.2,
          category: 'VEGETABLES'
        },
        {
          id: 8,
          foodName: 'Olive Oil',
          quantityGrams: 10,
          calories: 88,
          protein: 0.0,
          carbs: 0.0,
          fat: 10.0,
          category: 'FATS'
        }
      ]
    },
    {
      id: 3,
      mealType: 'DINNER',
      mealName: 'Nutritious Dinner Meal',
      totalCalories: 580,
      totalProtein: 42.1,
      totalCarbs: 62.3,
      totalFat: 16.2,
      preparationTimeMinutes: 30,
      instructions: 'Bake salmon with sweet potato and steamed broccoli.',
      foodItems: [
        {
          id: 9,
          foodName: 'Salmon Fillet',
          quantityGrams: 150,
          calories: 292,
          protein: 34.3,
          carbs: 0.0,
          fat: 17.1,
          category: 'PROTEIN'
        },
        {
          id: 10,
          foodName: 'Sweet Potato',
          quantityGrams: 200,
          calories: 172,
          protein: 3.2,
          carbs: 40.0,
          fat: 0.1,
          category: 'CARBS'
        },
        {
          id: 11,
          foodName: 'Broccoli',
          quantityGrams: 100,
          calories: 34,
          protein: 2.8,
          carbs: 7.0,
          fat: 0.4,
          category: 'VEGETABLES'
        }
      ]
    },
    {
      id: 4,
      mealType: 'SNACK',
      mealName: 'Healthy Snack Option',
      totalCalories: 180,
      totalProtein: 8.5,
      totalCarbs: 22.1,
      totalFat: 6.3,
      preparationTimeMinutes: 5,
      instructions: 'Mix nuts and seeds, or have a piece of fruit.',
      foodItems: [
        {
          id: 12,
          foodName: 'Apple',
          quantityGrams: 150,
          calories: 78,
          protein: 0.4,
          carbs: 20.6,
          fat: 0.3,
          category: 'FRUITS'
        },
        {
          id: 13,
          foodName: 'Walnuts',
          quantityGrams: 20,
          calories: 131,
          protein: 3.1,
          carbs: 2.8,
          fat: 13.1,
          category: 'FATS'
        }
      ]
    }
  ];

  const totalDailyCalories = mockMeals.reduce((sum, meal) => sum + meal.totalCalories, 0);
  const totalProtein = mockMeals.reduce((sum, meal) => sum + meal.totalProtein, 0);
  const totalCarbs = mockMeals.reduce((sum, meal) => sum + meal.totalCarbs, 0);
  const totalFat = mockMeals.reduce((sum, meal) => sum + meal.totalFat, 0);

  return (
    <div className="row">
      <div className="col-lg-8">
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="card-title mb-0">
                  <i className="bi bi-calendar-check me-2"></i>
                  {dietPlan.planName}
                </h5>
                <p className="text-muted small mb-0">
                  Created on {new Date(dietPlan.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="d-flex gap-2">
                <span className="badge bg-success fs-6">
                  {dietPlan.fitnessGoal?.replace('_', ' ')}
                </span>
                <span className="badge bg-primary fs-6">
                  {dietPlan.dailyCalorieTarget} cal/day
                </span>
              </div>
            </div>
          </div>
          <div className="card-body">
            <div className="row mb-4">
              <div className="col-md-3">
                <div className="text-center">
                  <div className="text-primary mb-2">
                    <i className="bi bi-fire fs-1"></i>
                  </div>
                  <h6 className="text-muted">Total Calories</h6>
                  <h4 className="fw-bold">{totalDailyCalories}</h4>
                  <small className="text-muted">Target: {dietPlan.dailyCalorieTarget}</small>
                </div>
              </div>
              <div className="col-md-3">
                <div className="text-center">
                  <div className="text-success mb-2">
                    <i className="bi bi-egg-fried fs-1"></i>
                  </div>
                  <h6 className="text-muted">Protein</h6>
                  <h4 className="fw-bold">{totalProtein.toFixed(1)}g</h4>
                  <small className="text-muted">Target: {dietPlan.totalProteinGrams?.toFixed(1)}g</small>
                </div>
              </div>
              <div className="col-md-3">
                <div className="text-center">
                  <div className="text-warning mb-2">
                    <i className="bi bi-bread-slice fs-1"></i>
                  </div>
                  <h6 className="text-muted">Carbs</h6>
                  <h4 className="fw-bold">{totalCarbs.toFixed(1)}g</h4>
                  <small className="text-muted">Target: {dietPlan.totalCarbsGrams?.toFixed(1)}g</small>
                </div>
              </div>
              <div className="col-md-3">
                <div className="text-center">
                  <div className="text-info mb-2">
                    <i className="bi bi-droplet fs-1"></i>
                  </div>
                  <h6 className="text-muted">Fat</h6>
                  <h4 className="fw-bold">{totalFat.toFixed(1)}g</h4>
                  <small className="text-muted">Target: {dietPlan.totalFatGrams?.toFixed(1)}g</small>
                </div>
              </div>
            </div>

            <div className="accordion" id="mealAccordion">
              {mockMeals.map((meal, index) => (
                <div className="accordion-item border mb-3" key={meal.id}>
                  <h2 className="accordion-header" id={`heading${meal.id}`}>
                    <button
                      className={`accordion-button ${expandedMeal !== meal.id ? 'collapsed' : ''}`}
                      type="button"
                      onClick={() => toggleMealExpansion(meal.id)}
                      style={{ backgroundColor: expandedMeal === meal.id ? '#f8f9fa' : 'white' }}
                    >
                      <div className="d-flex justify-content-between align-items-center w-100 me-3">
                        <div className="d-flex align-items-center">
                          <div className={`text-${getMealColor(meal.mealType)} me-3`}>
                            <i className={`bi ${getMealIcon(meal.mealType)} fs-4`}></i>
                          </div>
                          <div>
                            <h6 className="mb-0 fw-semibold">{meal.mealName}</h6>
                            <small className="text-muted">{meal.mealType}</small>
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                          <span className="badge bg-primary">{meal.totalCalories} cal</span>
                          <span className="badge bg-success">{meal.totalProtein.toFixed(1)}g protein</span>
                          <span className="badge bg-warning">{meal.totalCarbs.toFixed(1)}g carbs</span>
                          <span className="badge bg-info">{meal.totalFat.toFixed(1)}g fat</span>
                          <small className="text-muted">
                            <i className="bi bi-clock me-1"></i>
                            {meal.preparationTimeMinutes} min
                          </small>
                        </div>
                      </div>
                    </button>
                  </h2>
                  <div
                    id={`collapse${meal.id}`}
                    className={`accordion-collapse collapse ${expandedMeal === meal.id ? 'show' : ''}`}
                    aria-labelledby={`heading${meal.id}`}
                  >
                    <div className="accordion-body">
                      <div className="row">
                        <div className="col-md-6">
                          <h6 className="fw-semibold mb-3">Instructions</h6>
                          <p className="text-muted">{meal.instructions}</p>
                          
                          <h6 className="fw-semibold mb-3 mt-4">Ingredients</h6>
                          <div className="list-group list-group-flush">
                            {meal.foodItems.map((food) => (
                              <div key={food.id} className="list-group-item d-flex justify-content-between align-items-center px-0">
                                <div>
                                  <strong>{food.foodName}</strong>
                                  <small className="text-muted d-block">{food.category}</small>
                                </div>
                                <div className="text-end">
                                  <span className="badge bg-secondary">{food.quantityGrams}g</span>
                                  <div className="small text-muted mt-1">
                                    {food.calories} cal | {food.protein.toFixed(1)}g P | {food.carbs.toFixed(1)}g C | {food.fat.toFixed(1)}g F
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <h6 className="fw-semibold mb-3">Nutritional Breakdown</h6>
                          <div className="mb-3">
                            <div className="d-flex justify-content-between mb-1">
                              <span>Protein</span>
                              <span>{meal.totalProtein.toFixed(1)}g ({((meal.totalProtein * 4) / meal.totalCalories * 100).toFixed(1)}%)</span>
                            </div>
                            <div className="progress" style={{ height: '8px' }}>
                              <div 
                                className="progress-bar bg-success" 
                                style={{ width: `${(meal.totalProtein * 4) / meal.totalCalories * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="mb-3">
                            <div className="d-flex justify-content-between mb-1">
                              <span>Carbs</span>
                              <span>{meal.totalCarbs.toFixed(1)}g ({((meal.totalCarbs * 4) / meal.totalCalories * 100).toFixed(1)}%)</span>
                            </div>
                            <div className="progress" style={{ height: '8px' }}>
                              <div 
                                className="progress-bar bg-warning" 
                                style={{ width: `${(meal.totalCarbs * 4) / meal.totalCalories * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="mb-3">
                            <div className="d-flex justify-content-between mb-1">
                              <span>Fat</span>
                              <span>{meal.totalFat.toFixed(1)}g ({((meal.totalFat * 9) / meal.totalCalories * 100).toFixed(1)}%)</span>
                            </div>
                            <div className="progress" style={{ height: '8px' }}>
                              <div 
                                className="progress-bar bg-info" 
                                style={{ width: `${(meal.totalFat * 9) / meal.totalCalories * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-4">
        <div className="card border-0 shadow-sm mb-3">
          <div className="card-header bg-white">
            <h6 className="card-title mb-0">
              <i className="bi bi-pie-chart me-2"></i>
              Daily Progress
            </h6>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span>Calories</span>
                <span className="badge bg-primary">{totalDailyCalories}/{dietPlan.dailyCalorieTarget}</span>
              </div>
              <div className="progress" style={{ height: '8px' }}>
                <div 
                  className="progress-bar bg-primary" 
                  style={{ width: `${Math.min((totalDailyCalories / dietPlan.dailyCalorieTarget) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="alert alert-success small" role="alert">
              <i className="bi bi-check-circle me-2"></i>
              Great! Your meal plan meets your daily targets perfectly.
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white">
            <h6 className="card-title mb-0">
              <i className="bi bi-lightbulb me-2"></i>
              Tips
            </h6>
          </div>
          <div className="card-body">
            <ul className="small text-muted mb-0">
              <li className="mb-2">Drink plenty of water throughout the day</li>
              <li className="mb-2">Meal prep on weekends to save time</li>
              <li className="mb-2">Adjust portions based on your hunger levels</li>
              <li>Track your progress and adjust as needed</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DietPlanDisplay;
