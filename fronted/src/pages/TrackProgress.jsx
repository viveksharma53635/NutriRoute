import React, { useState, useEffect } from 'react';
import DailySummary from '../components/MealTracking/DailySummary';
import MealLogList from '../components/MealTracking/MealLogList';
import AddMealModal from '../components/MealTracking/AddMealModal';
import WeeklyProgress from '../components/MealTracking/WeeklyProgress';
import { authService } from '../services/apiService';
import './TrackProgress.css';

const DAILY_CALORIE_TARGET = 2000;

const TrackProgress = () => {
  const [activeTab, setActiveTab] = useState('today');
  const [todayMeals, setTodayMeals] = useState([]);
  const [dailySummary, setDailySummary] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const normalizeMealLog = (log) => {
    const meal = log?.meal || {};
    return {
      id: log?.id,
      mealLogId: log?.id,
      mealId: log?.mealId || meal?.id,
      mealType: meal?.mealType || 'SNACK',
      foodName: meal?.name || 'Meal',
      calories: meal?.calories || log?.caloriesConsumed || 0,
      protein: meal?.protein || 0,
      carbs: meal?.carbs || 0,
      fat: meal?.fat || 0,
      quantityGrams: 100,
      createdAt: log?.consumedAt
    };
  };

  const buildSummaryFromMeals = (meals, summaryDate) => {
    const totals = meals.reduce(
      (acc, meal) => {
        acc.totalCalories += meal.calories || 0;
        acc.totalProtein += meal.protein || 0;
        acc.totalCarbs += meal.carbs || 0;
        acc.totalFat += meal.fat || 0;
        if (meal.mealType === 'BREAKFAST') acc.breakfastCount += 1;
        if (meal.mealType === 'LUNCH') acc.lunchCount += 1;
        if (meal.mealType === 'DINNER') acc.dinnerCount += 1;
        if (meal.mealType === 'SNACK') acc.snackCount += 1;
        return acc;
      },
      {
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        breakfastCount: 0,
        lunchCount: 0,
        dinnerCount: 0,
        snackCount: 0
      }
    );

    const caloriesRemaining = DAILY_CALORIE_TARGET - totals.totalCalories;
    return {
      ...totals,
      summaryDate,
      dailyCalorieTarget: DAILY_CALORIE_TARGET,
      caloriesRemaining,
      goalAchieved: Math.abs(caloriesRemaining) <= 200
    };
  };

  const buildWeeklySummaries = (logs) => {
    const grouped = logs.reduce((acc, log) => {
      const normalized = normalizeMealLog(log);
      const dayKey = (normalized.createdAt || new Date().toISOString()).split('T')[0];
      if (!acc[dayKey]) acc[dayKey] = [];
      acc[dayKey].push(normalized);
      return acc;
    }, {});

    return Object.entries(grouped).map(([day, meals]) => buildSummaryFromMeals(meals, day));
  };

  const computeCurrentStreak = (summaries) => {
    if (!summaries.length) return 0;
    const days = [...new Set(summaries.map((s) => s.summaryDate))].sort().reverse();
    let streak = 0;
    let expected = new Date();
    expected.setHours(0, 0, 0, 0);

    for (const day of days) {
      const date = new Date(day);
      date.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((expected - date) / (24 * 60 * 60 * 1000));
      if (diffDays === 0) {
        streak += 1;
        expected.setDate(expected.getDate() - 1);
      } else if (streak === 0 && diffDays === 1) {
        streak += 1;
        expected.setDate(expected.getDate() - 2);
      } else {
        break;
      }
    }
    return streak;
  };

  useEffect(() => {
    fetchTodayData();
    fetchWeeklyData();
  }, []);

  useEffect(() => {
    const totalCalories = weeklyData.reduce((sum, day) => sum + (day.totalCalories || 0), 0);
    setStatistics({
      currentStreak: computeCurrentStreak(weeklyData),
      weekAverageCalories: weeklyData.length ? Math.round(totalCalories / weeklyData.length) : 0,
      todayMeals: todayMeals.length
    });
  }, [weeklyData, todayMeals]);

  const fetchTodayData = async () => {
    try {
      setLoading(true);
      const mealsResponse = await authService.getTodayMealLogs();
      const normalizedMeals = (mealsResponse.data || []).map(normalizeMealLog);
      setTodayMeals(normalizedMeals);
      setDailySummary(buildSummaryFromMeals(normalizedMeals, new Date().toISOString()));
    } catch (error) {
      console.error('Error fetching today data:', error);
      setError('Failed to load today\'s data');
    } finally {
      setLoading(false);
    }
  };

  const fetchWeeklyData = async () => {
    try {
      const response = await authService.getMealLogHistory();
      const summaries = buildWeeklySummaries(response.data || []);
      setWeeklyData(summaries);
    } catch (error) {
      console.error('Error fetching weekly data:', error);
    }
  };

  const handleAddMeal = async (mealData) => {
    try {
      if (!mealData.mealId) {
        setError('Please select a food from Search or Popular Foods before adding.');
        return;
      }
      setLoading(true);
      await authService.addMealLog({
        mealId: mealData.mealId,
        caloriesConsumed: Number(mealData.calories || 0),
        consumedAt: new Date().toISOString()
      });
      
      // Refresh today's data
      await fetchTodayData();
      await fetchWeeklyData();
      
      setShowAddMealModal(false);
      setError('');
    } catch (error) {
      console.error('Error adding meal:', error);
      setError('Failed to add meal');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMeal = async (mealId) => {
    setError('Delete meal is not available yet in backend API.');
  };

  const handleEditMeal = async (mealId, mealData) => {
    setError('Edit meal is not available yet in backend API.');
  };

  const getCalorieProgress = () => {
    if (!dailySummary || !dailySummary.dailyCalorieTarget) return 0;
    return Math.min((dailySummary.totalCalories / dailySummary.dailyCalorieTarget) * 100, 100);
  };

  const getCalorieStatus = () => {
    if (!dailySummary || !dailySummary.dailyCalorieTarget) return 'neutral';
    
    const remaining = dailySummary.caloriesRemaining;
    if (remaining > 200) return 'low';
    if (remaining < -200) return 'over';
    return 'on-track';
  };

  const getStatusColor = () => {
    const status = getCalorieStatus();
    switch (status) {
      case 'low': return 'warning';
      case 'over': return 'danger';
      case 'on-track': return 'success';
      default: return 'secondary';
    }
  };

  const getStatusMessage = () => {
    const status = getCalorieStatus();
    switch (status) {
      case 'low':
        return `You have ${dailySummary?.caloriesRemaining || 0} calories remaining`;
      case 'over':
        return `You're ${Math.abs(dailySummary?.caloriesRemaining || 0)} calories over target`;
      case 'on-track':
        return 'Perfect! You\'re on track with your calorie goal';
      default:
        return 'Track your meals to see progress';
    }
  };

  if (loading && !dailySummary) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-4 px-xl-5 py-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="h3 mb-1">Track Progress</h1>
              <p className="text-muted">Monitor your daily nutrition and calorie intake</p>
            </div>
            <button
              className="btn btn-success"
              onClick={() => setShowAddMealModal(true)}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Add Meal
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="row mb-3">
          <div className="col-12">
            <div className="alert alert-danger" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
              <button
                type="button"
                className="btn-close float-end"
                onClick={() => setError('')}
              ></button>
            </div>
          </div>
        </div>
      )}

      {/* Daily Summary Card */}
      <div className="row mb-4">
        <div className="col-12">
          <DailySummary
            summary={dailySummary}
            statistics={statistics}
            onAddMeal={() => setShowAddMealModal(true)}
          />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="row">
        <div className="col-12">
          <ul className="nav nav-tabs mb-4" id="progressTabs" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'today' ? 'active' : ''}`}
                onClick={() => setActiveTab('today')}
                type="button"
                role="tab"
              >
                <i className="bi bi-calendar-day me-2"></i>
                Today
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'week' ? 'active' : ''}`}
                onClick={() => setActiveTab('week')}
                type="button"
                role="tab"
              >
                <i className="bi bi-calendar-week me-2"></i>
                This Week
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => setActiveTab('history')}
                type="button"
                role="tab"
              >
                <i className="bi bi-calendar-history me-2"></i>
                History
              </button>
            </li>
          </ul>

          <div className="tab-content">
            {activeTab === 'today' && (
              <div className="row">
                <div className="col-lg-8">
                  <MealLogList
                    meals={todayMeals}
                    onDelete={handleDeleteMeal}
                    onEdit={handleEditMeal}
                    loading={loading}
                  />
                </div>
                <div className="col-lg-4">
                  <div className="card border-0 shadow-sm mb-3">
                    <div className="card-header bg-white">
                      <h6 className="card-title mb-0">
                        <i className="bi bi-speedometer2 me-2"></i>
                        Today's Progress
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span>Calories</span>
                          <span className={`badge bg-${getStatusColor()}`}>
                            {dailySummary?.totalCalories || 0} / {dailySummary?.dailyCalorieTarget || 'N/A'}
                          </span>
                        </div>
                        <div className="progress" style={{ height: '12px' }}>
                          <div
                            className={`progress-bar bg-${getStatusColor()}`}
                            style={{ width: `${getCalorieProgress()}%` }}
                          ></div>
                        </div>
                        <small className="text-muted mt-1 d-block">{getStatusMessage()}</small>
                      </div>

                      {dailySummary && (
                        <div className="row text-center">
                          <div className="col-4">
                            <div className="text-success mb-1">
                              <i className="bi bi-egg-fried fs-4"></i>
                            </div>
                            <h6 className="mb-0">{dailySummary.totalProtein?.toFixed(1) || 0}g</h6>
                            <small className="text-muted">Protein</small>
                          </div>
                          <div className="col-4">
                            <div className="text-warning mb-1">
                              <i className="bi bi-bread-slice fs-4"></i>
                            </div>
                            <h6 className="mb-0">{dailySummary.totalCarbs?.toFixed(1) || 0}g</h6>
                            <small className="text-muted">Carbs</small>
                          </div>
                          <div className="col-4">
                            <div className="text-info mb-1">
                              <i className="bi bi-droplet fs-4"></i>
                            </div>
                            <h6 className="mb-0">{dailySummary.totalFat?.toFixed(1) || 0}g</h6>
                            <small className="text-muted">Fat</small>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {statistics && (
                    <div className="card border-0 shadow-sm">
                      <div className="card-header bg-white">
                        <h6 className="card-title mb-0">
                          <i className="bi bi-trophy me-2"></i>
                          Your Stats
                        </h6>
                      </div>
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span>Current Streak</span>
                          <span className="badge bg-primary">{statistics.currentStreak} days</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span>Week Average</span>
                          <span className="badge bg-info">{statistics.weekAverageCalories} cal</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <span>Meals Today</span>
                          <span className="badge bg-secondary">{statistics.todayMeals}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'week' && (
              <WeeklyProgress
                weeklyData={weeklyData}
                loading={loading}
              />
            )}

            {activeTab === 'history' && (
              <div className="text-center py-5">
                <i className="bi bi-calendar-history fs-1 text-muted mb-3"></i>
                <h4>Meal History</h4>
                <p className="text-muted">
                  View your historical meal data and trends here.
                </p>
                <div className="alert alert-info" role="alert">
                  <i className="bi bi-info-circle me-2"></i>
                  Historical data and detailed analytics coming soon!
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Meal Modal */}
      {showAddMealModal && (
        <AddMealModal
          show={showAddMealModal}
          onHide={() => setShowAddMealModal(false)}
          onAddMeal={handleAddMeal}
          loading={loading}
        />
      )}
    </div>
  );
};

export default TrackProgress;
