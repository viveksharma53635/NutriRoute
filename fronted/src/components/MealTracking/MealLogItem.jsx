import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const MealLogItem = ({ meal, isEditing, onEdit, onSave, onCancel, onDelete, isLast }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    defaultValues: {
      foodName: meal.foodName || '',
      quantityGrams: meal.quantityGrams || 100,
      calories: meal.calories || 0,
      protein: meal.protein || 0,
      carbs: meal.carbs || 0,
      fat: meal.fat || 0,
      notes: meal.notes || ''
    }
  });

  const watchedValues = watch();

  const handleFormSubmit = (data) => {
    const updatedMeal = {
      ...meal,
      ...data
    };
    onSave(updatedMeal);
  };

  const handleCancelEdit = () => {
    reset();
    onCancel();
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

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

  if (isEditing) {
    return (
      <div className="card border-0 shadow-sm mb-2">
        <div className="card-body p-3">
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="row">
              <div className="col-md-6 mb-2">
                <input
                  type="text"
                  className={`form-control form-control-sm ${errors.foodName ? 'is-invalid' : ''}`}
                  placeholder="Food name"
                  {...register('foodName', { required: 'Food name is required' })}
                />
                {errors.foodName && (
                  <div className="invalid-feedback">{errors.foodName.message}</div>
                )}
              </div>
              <div className="col-md-3 mb-2">
                <input
                  type="number"
                  step="0.1"
                  className={`form-control form-control-sm ${errors.quantityGrams ? 'is-invalid' : ''}`}
                  placeholder="Quantity (g)"
                  {...register('quantityGrams', { 
                    required: 'Quantity is required',
                    min: { value: 1, message: 'Must be at least 1g' }
                  })}
                />
                {errors.quantityGrams && (
                  <div className="invalid-feedback">{errors.quantityGrams.message}</div>
                )}
              </div>
              <div className="col-md-3 mb-2">
                <input
                  type="number"
                  className={`form-control form-control-sm ${errors.calories ? 'is-invalid' : ''}`}
                  placeholder="Calories"
                  {...register('calories', { 
                    required: 'Calories are required',
                    min: { value: 0, message: 'Cannot be negative' }
                  })}
                />
                {errors.calories && (
                  <div className="invalid-feedback">{errors.calories.message}</div>
                )}
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-4 mb-2">
                <input
                  type="number"
                  step="0.1"
                  className="form-control form-control-sm"
                  placeholder="Protein (g)"
                  {...register('protein', { min: 0 })}
                />
              </div>
              <div className="col-md-4 mb-2">
                <input
                  type="number"
                  step="0.1"
                  className="form-control form-control-sm"
                  placeholder="Carbs (g)"
                  {...register('carbs', { min: 0 })}
                />
              </div>
              <div className="col-md-4 mb-2">
                <input
                  type="number"
                  step="0.1"
                  className="form-control form-control-sm"
                  placeholder="Fat (g)"
                  {...register('fat', { min: 0 })}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-12 mb-2">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Notes (optional)"
                  {...register('notes')}
                />
              </div>
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-success btn-sm">
                <i className="bi bi-check-circle me-1"></i>
                Save
              </button>
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleCancelEdit}>
                <i className="bi bi-x-circle me-1"></i>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`card border-0 shadow-sm mb-2 ${!isLast ? 'border-bottom' : ''}`}>
      <div className="card-body p-3">
        <div className="d-flex justify-content-between align-items-start">
          <div className="flex-grow-1">
            <div className="d-flex align-items-center mb-2">
              <h6 className="mb-0 fw-semibold">{meal.foodName}</h6>
              <small className="text-muted ms-2">
                {formatTime(meal.createdAt)}
              </small>
            </div>
            
            <div className="d-flex flex-wrap gap-3 mb-2">
              <span className="badge bg-primary">
                <i className="bi bi-fire me-1"></i>
                {meal.calories} cal
              </span>
              <span className="badge bg-success">
                <i className="bi bi-egg-fried me-1"></i>
                {meal.protein?.toFixed(1) || 0}g protein
              </span>
              <span className="badge bg-warning">
                <i className="bi bi-bread-slice me-1"></i>
                {meal.carbs?.toFixed(1) || 0}g carbs
              </span>
              <span className="badge bg-info">
                <i className="bi bi-droplet me-1"></i>
                {meal.fat?.toFixed(1) || 0}g fat
              </span>
              <span className="badge bg-secondary">
                <i className="bi bi-weight me-1"></i>
                {meal.quantityGrams}g
              </span>
            </div>

            {meal.notes && (
              <div className="text-muted small mb-2">
                <i className="bi bi-chat-text me-1"></i>
                {meal.notes}
              </div>
            )}

            {(meal.fiber || meal.sugar || meal.sodium) && (
              <div className="text-muted small">
                {meal.fiber && (
                  <span className="me-3">
                    <i className="bi bi-flower1 me-1"></i>
                    Fiber: {meal.fiber.toFixed(1)}g
                  </span>
                )}
                {meal.sugar && (
                  <span className="me-3">
                    <i className="bi bi-cup me-1"></i>
                    Sugar: {meal.sugar.toFixed(1)}g
                  </span>
                )}
                {meal.sodium && (
                  <span>
                    <i className="bi bi-droplet me-1"></i>
                    Sodium: {meal.sodium.toFixed(1)}mg
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="d-flex gap-1">
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => setShowDetails(!showDetails)}
              title="Toggle details"
            >
              <i className={`bi bi-chevron-${showDetails ? 'up' : 'down'}`}></i>
            </button>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={onEdit}
              title="Edit meal"
            >
              <i className="bi bi-pencil"></i>
            </button>
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={onDelete}
              title="Delete meal"
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
        </div>

        {showDetails && (
          <div className="mt-3 pt-3 border-top">
            <div className="row">
              <div className="col-md-6">
                <h6 className="fw-semibold mb-2">Nutritional Information</h6>
                <div className="small">
                  <div className="d-flex justify-content-between mb-1">
                    <span>Calories</span>
                    <span className="fw-semibold">{meal.calories} kcal</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span>Protein</span>
                    <span className="fw-semibold">{meal.protein?.toFixed(1) || 0}g</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span>Carbohydrates</span>
                    <span className="fw-semibold">{meal.carbs?.toFixed(1) || 0}g</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span>Fat</span>
                    <span className="fw-semibold">{meal.fat?.toFixed(1) || 0}g</span>
                  </div>
                  {meal.fiber && (
                    <div className="d-flex justify-content-between mb-1">
                      <span>Fiber</span>
                      <span className="fw-semibold">{meal.fiber.toFixed(1)}g</span>
                    </div>
                  )}
                  {meal.sugar && (
                    <div className="d-flex justify-content-between mb-1">
                      <span>Sugar</span>
                      <span className="fw-semibold">{meal.sugar.toFixed(1)}g</span>
                    </div>
                  )}
                  {meal.sodium && (
                    <div className="d-flex justify-content-between">
                      <span>Sodium</span>
                      <span className="fw-semibold">{meal.sodium.toFixed(1)}mg</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <h6 className="fw-semibold mb-2">Macro Distribution</h6>
                <div className="mb-2">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span>Protein</span>
                    <span className="small">
                      {meal.protein ? ((meal.protein * 4) / meal.calories * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                  <div className="progress" style={{ height: '6px' }}>
                    <div 
                      className="progress-bar bg-success" 
                      style={{ width: `${meal.protein ? ((meal.protein * 4) / meal.calories * 100) : 0}%` }}
                    ></div>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span>Carbs</span>
                    <span className="small">
                      {meal.carbs ? ((meal.carbs * 4) / meal.calories * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                  <div className="progress" style={{ height: '6px' }}>
                    <div 
                      className="progress-bar bg-warning" 
                      style={{ width: `${meal.carbs ? ((meal.carbs * 4) / meal.calories * 100) : 0}%` }}
                    ></div>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span>Fat</span>
                    <span className="small">
                      {meal.fat ? ((meal.fat * 9) / meal.calories * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                  <div className="progress" style={{ height: '6px' }}>
                    <div 
                      className="progress-bar bg-info" 
                      style={{ width: `${meal.fat ? ((meal.fat * 9) / meal.calories * 100) : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealLogItem;
