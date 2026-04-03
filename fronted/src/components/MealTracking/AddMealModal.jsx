import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { authService } from '../../services/apiService';

const AddMealModal = ({ show, onHide, onAddMeal, loading }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [popularFoods, setPopularFoods] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('search');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm({
    defaultValues: {
      mealType: 'BREAKFAST',
      foodName: '',
      quantityGrams: 100,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      notes: ''
    }
  });

  const watchedValues = watch();

  useEffect(() => {
    if (show) {
      fetchPopularFoods();
      reset();
      setSelectedFood(null);
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [show]);

  useEffect(() => {
    if (selectedFood) {
      const factor = (watchedValues.quantityGrams || 100) / 100.0;
      setValue('foodName', selectedFood.name || '');
      setValue('calories', Math.round((selectedFood.calories || 0) * factor));
      setValue('protein', ((selectedFood.protein || 0) * factor).toFixed(1));
      setValue('carbs', ((selectedFood.carbs || 0) * factor).toFixed(1));
      setValue('fat', ((selectedFood.fat || 0) * factor).toFixed(1));
    }
  }, [selectedFood, watchedValues.quantityGrams, setValue]);

  useEffect(() => {
    if (searchQuery && searchQuery.length >= 2) {
      searchFoods();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const fetchPopularFoods = async () => {
    try {
      const response = await authService.getMealCatalog();
      setPopularFoods(response.data);
    } catch (error) {
      console.error('Error fetching popular foods:', error);
    }
  };

  const searchFoods = async () => {
    if (searchQuery.length < 2) return;
    
    try {
      setSearchLoading(true);
      const response = await authService.getMealCatalog();
      const allFoods = Array.isArray(response.data) ? response.data : [];
      const filteredFoods = allFoods.filter((food) =>
        (food?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredFoods);
    } catch (error) {
      console.error('Error searching foods:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleFoodSelect = (food) => {
    setSelectedFood(food);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleManualEntry = () => {
    setSelectedFood(null);
  };

  const onSubmit = (data) => {
    const mealData = {
      ...data,
      calories: parseInt(data.calories),
      protein: parseFloat(data.protein),
      carbs: parseFloat(data.carbs),
      fat: parseFloat(data.fat),
      mealId: selectedFood?.id
    };
    
    onAddMeal(mealData);
  };

  const calculateNutrition = () => {
    if (!selectedFood) return;
    
    const factor = (watchedValues.quantityGrams || 100) / 100.0;
    setValue('calories', Math.round((selectedFood.calories || 0) * factor));
    setValue('protein', ((selectedFood.protein || 0) * factor).toFixed(1));
    setValue('carbs', ((selectedFood.carbs || 0) * factor).toFixed(1));
    setValue('fat', ((selectedFood.fat || 0) * factor).toFixed(1));
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

  if (!show) return null;

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-plus-circle me-2"></i>
              Add Meal
            </h5>
            <button type="button" className="btn-close" onClick={onHide}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Meal Type Selection */}
              <div className="row mb-3">
                <div className="col-12">
                  <label className="form-label fw-semibold">Meal Type</label>
                  <div className="btn-group w-100" role="group">
                    {['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'].map(type => (
                      <button
                        key={type}
                        type="button"
                        className={`btn ${watchedValues.mealType === type ? 'btn-success' : 'btn-outline-success'}`}
                        onClick={() => setValue('mealType', type)}
                      >
                        <i className={`bi ${getMealIcon(type)} me-2`}></i>
                        {type.charAt(0) + type.slice(1).toLowerCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Food Selection Tabs */}
              <div className="row mb-3">
                <div className="col-12">
                  <ul className="nav nav-tabs" id="foodTabs" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeTab === 'search' ? 'active' : ''}`}
                        onClick={() => setActiveTab('search')}
                        type="button"
                      >
                        <i className="bi bi-search me-2"></i>
                        Search Food
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeTab === 'popular' ? 'active' : ''}`}
                        onClick={() => setActiveTab('popular')}
                        type="button"
                      >
                        <i className="bi bi-star me-2"></i>
                        Popular Foods
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeTab === 'manual' ? 'active' : ''}`}
                        onClick={() => { setActiveTab('manual'); handleManualEntry(); }}
                        type="button"
                      >
                        <i className="bi bi-pencil me-2"></i>
                        Manual Entry
                      </button>
                    </li>
                  </ul>

                  <div className="tab-content mt-3">
                    {activeTab === 'search' && (
                      <div className="tab-pane fade show active">
                        <div className="input-group mb-3">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search for food..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                          {searchLoading && (
                            <span className="input-group-text">
                              <div className="spinner-border spinner-border-sm" role="status"></div>
                            </span>
                          )}
                        </div>

                        {searchResults.length > 0 && (
                          <div className="list-group max-height-200 overflow-auto">
                            {searchResults.map(food => (
                              <button
                                key={food.id}
                                type="button"
                                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                                onClick={() => handleFoodSelect(food)}
                              >
                                <div>
                                  <strong>{food.name}</strong>
                                  <div className="small text-muted">
                                    {food.calories} cal • {food.mealType}
                                  </div>
                                </div>
                                <div className="text-end">
                                  <div className="small">
                                    P: {food.protein}g | C: {food.carbs}g | F: {food.fat}g
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}

                        {searchQuery && searchResults.length === 0 && !searchLoading && (
                          <div className="alert alert-info">
                            <i className="bi bi-info-circle me-2"></i>
                            No foods found. Try a different search term or use manual entry.
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'popular' && (
                      <div className="tab-pane fade show active">
                        <div className="row">
                          {popularFoods.map(food => (
                            <div key={food.id} className="col-md-6 mb-2">
                              <button
                                type="button"
                                className="btn btn-outline-secondary w-100 text-start"
                                onClick={() => handleFoodSelect(food)}
                              >
                                <div className="d-flex justify-content-between align-items-center">
                                  <span>{food.name}</span>
                                  <small className="text-muted">{food.calories} cal</small>
                                </div>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'manual' && (
                      <div className="tab-pane fade show active">
                        <div className="alert alert-info">
                          <i className="bi bi-info-circle me-2"></i>
                          Enter nutritional information manually for custom foods or recipes.
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Selected Food Display */}
              {selectedFood && (
                <div className="row mb-3">
                  <div className="col-12">
                    <div className="alert alert-success">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{selectedFood.name}</strong>
                          <div className="small text-muted">
                            {selectedFood.calories} cal • {selectedFood.mealType}
                          </div>
                        </div>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => setSelectedFood(null)}
                        >
                          <i className="bi bi-x"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Food Name and Quantity */}
              <div className="row mb-3">
                <div className="col-md-8">
                  <label className="form-label fw-semibold">Food Name</label>
                  <input
                    type="text"
                    className={`form-control ${errors.foodName ? 'is-invalid' : ''}`}
                    placeholder="Enter food name"
                    {...register('foodName', { required: 'Food name is required' })}
                    disabled={!!selectedFood}
                  />
                  {errors.foodName && (
                    <div className="invalid-feedback">{errors.foodName.message}</div>
                  )}
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Quantity (grams)</label>
                  <input
                    type="number"
                    step="0.1"
                    className={`form-control ${errors.quantityGrams ? 'is-invalid' : ''}`}
                    {...register('quantityGrams', { 
                      required: 'Quantity is required',
                      min: { value: 1, message: 'Must be at least 1g' }
                    })}
                    onChange={calculateNutrition}
                  />
                  {errors.quantityGrams && (
                    <div className="invalid-feedback">{errors.quantityGrams.message}</div>
                  )}
                </div>
              </div>

              {/* Nutrition Values */}
              <div className="row mb-3">
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Calories</label>
                  <input
                    type="number"
                    className={`form-control ${errors.calories ? 'is-invalid' : ''}`}
                    {...register('calories', { 
                      required: 'Calories are required',
                      min: { value: 0, message: 'Cannot be negative' }
                    })}
                    disabled={!!selectedFood}
                  />
                  {errors.calories && (
                    <div className="invalid-feedback">{errors.calories.message}</div>
                  )}
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Protein (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-control"
                    {...register('protein', { min: 0 })}
                    disabled={!!selectedFood}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Carbs (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-control"
                    {...register('carbs', { min: 0 })}
                    disabled={!!selectedFood}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Fat (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-control"
                    {...register('fat', { min: 0 })}
                    disabled={!!selectedFood}
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="row mb-3">
                <div className="col-12">
                  <label className="form-label fw-semibold">Notes (optional)</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    placeholder="Add any notes about this meal..."
                    {...register('notes')}
                  ></textarea>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-secondary" onClick={onHide}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-success" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Adding...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-plus-circle me-2"></i>
                      Add Meal
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMealModal;
