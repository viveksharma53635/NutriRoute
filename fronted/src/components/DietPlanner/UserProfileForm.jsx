import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

const UserProfileForm = ({ initialData, onSubmit, loading }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    reset
  } = useForm({
    mode: 'onChange',
    defaultValues: initialData || {}
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const watchedFields = watch();
  const [isCalculating, setIsCalculating] = useState(false);

  const onFormSubmit = async (data) => {
    setIsCalculating(true);
    try {
      await onSubmit(data);
    } finally {
      setIsCalculating(false);
    }
  };

  const bmi = watchedFields.heightCm && watchedFields.weightKg 
    ? (watchedFields.weightKg / Math.pow(watchedFields.heightCm / 100, 2)).toFixed(1)
    : null;

  return (
    <div className="row">
      <div className="col-lg-8">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white">
            <h5 className="card-title mb-0">
              <i className="bi bi-person-badge me-2"></i>
              Personal Information
            </h5>
            <p className="text-muted small mb-0">
              Complete your profile to get personalized diet recommendations
            </p>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit(onFormSubmit)}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    placeholder="Enter your name"
                    {...register('name', {
                      required: 'Name is required',
                      maxLength: {
                        value: 100,
                        message: 'Name must not exceed 100 characters'
                      }
                    })}
                  />
                  {errors.name && (
                    <div className="invalid-feedback">{errors.name.message}</div>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Email <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    placeholder="Enter your email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email.message}</div>
                  )}
                </div>
              </div>

              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label fw-semibold">
                    Age <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className={`form-control ${errors.age ? 'is-invalid' : ''}`}
                    placeholder="Years"
                    {...register('age', {
                      required: 'Age is required',
                      min: {
                        value: 13,
                        message: 'Age must be at least 13'
                      },
                      max: {
                        value: 120,
                        message: 'Age must not exceed 120'
                      }
                    })}
                  />
                  {errors.age && (
                    <div className="invalid-feedback">{errors.age.message}</div>
                  )}
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label fw-semibold">
                    Gender <span className="text-danger">*</span>
                  </label>
                  <select
                    className={`form-select ${errors.gender ? 'is-invalid' : ''}`}
                    {...register('gender', {
                      required: 'Gender is required'
                    })}
                  >
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                  {errors.gender && (
                    <div className="invalid-feedback">{errors.gender.message}</div>
                  )}
                </div>

                <div className="col-md-4 mb-3">
                  <label className="form-label fw-semibold">
                    BMI
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={bmi || 'N/A'}
                    readOnly
                    disabled
                  />
                  {bmi && (
                    <small className={`text-${bmi < 18.5 ? 'warning' : bmi < 25 ? 'success' : bmi < 30 ? 'warning' : 'danger'}`}>
                      {bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese'}
                    </small>
                  )}
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Height (cm) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className={`form-control ${errors.heightCm ? 'is-invalid' : ''}`}
                    placeholder="Height in centimeters"
                    {...register('heightCm', {
                      required: 'Height is required',
                      min: {
                        value: 100,
                        message: 'Height must be at least 100 cm'
                      },
                      max: {
                        value: 250,
                        message: 'Height must not exceed 250 cm'
                      }
                    })}
                  />
                  {errors.heightCm && (
                    <div className="invalid-feedback">{errors.heightCm.message}</div>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Weight (kg) <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className={`form-control ${errors.weightKg ? 'is-invalid' : ''}`}
                    placeholder="Weight in kilograms"
                    {...register('weightKg', {
                      required: 'Weight is required',
                      min: {
                        value: 30,
                        message: 'Weight must be at least 30 kg'
                      },
                      max: {
                        value: 300,
                        message: 'Weight must not exceed 300 kg'
                      }
                    })}
                  />
                  {errors.weightKg && (
                    <div className="invalid-feedback">{errors.weightKg.message}</div>
                  )}
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Fitness Goal <span className="text-danger">*</span>
                  </label>
                  <select
                    className={`form-select ${errors.fitnessGoal ? 'is-invalid' : ''}`}
                    {...register('fitnessGoal', {
                      required: 'Fitness goal is required'
                    })}
                  >
                    <option value="">Select Goal</option>
                    <option value="WEIGHT_LOSS">Weight Loss</option>
                    <option value="WEIGHT_GAIN">Weight Gain</option>
                    <option value="MAINTENANCE">Maintenance</option>
                  </select>
                  {errors.fitnessGoal && (
                    <div className="invalid-feedback">{errors.fitnessGoal.message}</div>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">
                    Activity Level <span className="text-danger">*</span>
                  </label>
                  <select
                    className={`form-select ${errors.activityLevel ? 'is-invalid' : ''}`}
                    {...register('activityLevel', {
                      required: 'Activity level is required'
                    })}
                  >
                    <option value="">Select Activity Level</option>
                    <option value="SEDENTARY">Sedentary (little or no exercise)</option>
                    <option value="LIGHT">Light (1-3 days/week)</option>
                    <option value="MODERATE">Moderate (3-5 days/week)</option>
                    <option value="ACTIVE">Active (6-7 days/week)</option>
                    <option value="VERY_ACTIVE">Very Active (twice per day)</option>
                  </select>
                  {errors.activityLevel && (
                    <div className="invalid-feedback">{errors.activityLevel.message}</div>
                  )}
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="termsCheck"
                  />
                  <label className="form-check-label" htmlFor="termsCheck">
                    I agree to the terms and conditions
                  </label>
                </div>
                
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => reset(initialData || {})}
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={!isValid || loading || isCalculating}
                  >
                    {isCalculating ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Save Profile
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="col-lg-4">
        <div className="card border-0 shadow-sm mb-3">
          <div className="card-header bg-white">
            <h6 className="card-title mb-0">
              <i className="bi bi-info-circle me-2"></i>
              Profile Completion
            </h6>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span>Completion Status</span>
                <span className="badge bg-success">
                  {Object.values(watchedFields).filter(Boolean).length}/8
                </span>
              </div>
              <div className="progress" style={{ height: '8px' }}>
                <div 
                  className="progress-bar bg-success" 
                  style={{ width: `${(Object.values(watchedFields).filter(Boolean).length / 8) * 100}%` }}
                ></div>
              </div>
            </div>
            <small className="text-muted">
              Complete all fields to unlock calorie calculations and diet plan generation.
            </small>
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
              <li className="mb-2">Be honest about your activity level for accurate calculations</li>
              <li className="mb-2">Weight loss typically requires 500 calorie deficit per day</li>
              <li className="mb-2">Weight gain typically requires 500 calorie surplus per day</li>
              <li>Regular measurements help track progress effectively</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileForm;
