import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { Routes, Route, Navigate } from "react-router-dom";
import React from "react";

import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";

import Home from "./pages/Home";
import Registration from "./pages/Registration";
import TrackProgress from "./pages/TrackProgress";
import Dashboard from "./pages/Dashboard";
import DietPlanner from "./pages/DietPlanner";
import HealthyRecipes from "./pages/HealthyRecipes";
import ProfilePage from "./pages/ProfilePage";
import Subscription from "./pages/Subscription";
import PaymentFlow from "./pages/PaymentFlow";
import SignIn from './pages/SignIn';
import CoachDashboard from './pages/CoachDashboard';
import CoachClientsPage from './pages/CoachClientsPage';
import CoachChat from './pages/CoachChat';
import CoachPlansPage from './pages/CoachPlansPage';
import PremiumCoachChat from './pages/PremiumCoachChat';
import ManageDietPlans from './pages/admin/ManageDietPlans';
import ManageMeals from './pages/admin/ManageMeals';
import ManageUsers from './pages/admin/ManageUsers';
import SubscriptionAnalytics from './pages/admin/SubscriptionAnalytics';
import AdminSubscriptions from './pages/admin/AdminSubscriptions';
import AdminPayments from './pages/admin/AdminPayments';
import { LoginProvider } from './context/LoginContext';
import ProtectedRoute from './pages/ProtectedRoute';
import RoleBasedRoute from './components/RoleBasedRoute';

function App() {
  return (
    <LoginProvider>
      <Routes>
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<Registration />} />

        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />

          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="userdashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="track-progress"
            element={
              <ProtectedRoute>
                <TrackProgress />
              </ProtectedRoute>
            }
          />

          <Route path="diet-planner" element={<DietPlanner />} />
          <Route path="healthy-recipes" element={<HealthyRecipes />} />
          <Route path="healthy-menus" element={<Navigate to="/healthy-recipes" replace />} />

          <Route
            path="analytics"
            element={
              <ProtectedRoute requiredPlan="PRO">
                <TrackProgress />
              </ProtectedRoute>
            }
          />

          <Route
            path="coachchat"
            element={
              <ProtectedRoute requiredPlan="PREMIUM">
                <PremiumCoachChat />
              </ProtectedRoute>
            }
          />

          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="subscription"
            element={
              <ProtectedRoute>
                <Subscription />
              </ProtectedRoute>
            }
          />

          <Route
            path="payment"
            element={
              <ProtectedRoute>
                <PaymentFlow />
              </ProtectedRoute>
            }
          />

          <Route
            path="coach/dashboard"
            element={
              <RoleBasedRoute coachRoute={true}>
                <CoachDashboard />
              </RoleBasedRoute>
            }
          />
          <Route
            path="coach/clients"
            element={
              <RoleBasedRoute coachRoute={true}>
                <CoachClientsPage />
              </RoleBasedRoute>
            }
          />
          <Route
            path="coach/plans"
            element={
              <RoleBasedRoute coachRoute={true}>
                <CoachPlansPage />
              </RoleBasedRoute>
            }
          />
          <Route
            path="coach/chat/:userId"
            element={
              <RoleBasedRoute coachRoute={true}>
                <CoachChat />
              </RoleBasedRoute>
            }
          />
        </Route>

        <Route
          path="/admin"
          element={
            <RoleBasedRoute adminRoute={true}>
              <AdminLayout />
            </RoleBasedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="meals" element={<ManageMeals />} />
          <Route path="diet-plans" element={<ManageDietPlans />} />
          <Route path="subscriptions" element={<AdminSubscriptions />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="analytics" element={<SubscriptionAnalytics />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </LoginProvider>
  );
}

export default App;
