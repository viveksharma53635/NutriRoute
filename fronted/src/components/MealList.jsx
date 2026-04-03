import React from 'react'

function MealList({meals}) {
  return (
    <>
           <div className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white fw-bold">
                Today's Meals
              </div>
              <ul className="list-group list-group-flush">
                {meals.map((meal) => (
                  <li
                    key={meal.id}
                    className="list-group-item d-flex justify-content-between"
                  >
                    <div>
                      <b>{meal.name}</b>
                      <br />
                      <small className="text-muted">{meal.time}</small>
                    </div>
                    <span>{meal.calories} kcal</span>
                  </li>

                ))}
              </ul>
            </div>
          </div>
    </>
  )
}

export default MealList