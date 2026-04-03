import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json"
  }
});

const getStoredToken = () => {
  const sessionToken = sessionStorage.getItem("token");
  const localToken = localStorage.getItem("token");
  const rawToken = sessionToken || localToken;
  if (!rawToken || rawToken === "undefined" || rawToken === "null") return null;
  const trimmed = rawToken.trim();
  return trimmed.startsWith("Bearer ") ? trimmed.substring(7).trim() : trimmed;
};

api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url || "";
      if (import.meta.env.DEV) {
        // Debug only: track unauthorized endpoints without forcing logout.
        console.warn("[Auth] 401 Unauthorized:", requestUrl);
      }
      window.dispatchEvent(new CustomEvent("auth:unauthorized", { detail: { url: requestUrl } }));
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials) => api.post("/api/auth/login", credentials),
  register: (userData) => api.post("/api/auth/register", userData),
  getAvailableCoaches: () => api.get("/api/auth/coaches"),

  getUserProfile: (userId = null) => (userId ? api.get(`/api/chat/user/${userId}`) : api.get("/api/user/profile")),
  updateUserProfile: (payload) => api.put("/api/user/profile", payload),
  getUserDashboard: () => api.get("/api/user/dashboard"),
  getUserProgress: () => api.get("/api/user/progress"),
  getMeals: () => api.get("/api/meal-log/today"),
  getTodayMealLogs: () => api.get("/api/meal-log/today"),
  getMealLogHistory: () => api.get("/api/meal-log/history"),
  getMealCatalog: () => api.get("/api/meals"),
  addMealLog: (payload) => api.post("/api/meal-log", payload),

  getMessages: (coachId, userId) => api.get(`/api/chat/coach-user/${coachId}/${userId}`),
  sendMessage: (messageData) => api.post("/api/chat/send", messageData),
  markMessagesAsRead: (userId) => api.put(`/api/chat/read/${userId}`),
  getUnreadCount: (userId) => api.get(`/api/chat/unread/${userId}`),
  getCoachDashboard: () => api.get("/api/coach/dashboard"),
  getCoachClients: () => api.get("/api/coach/clients"),
  getCoachClientDetails: (clientId) => api.get(`/api/coach/clients/${clientId}`),
  getCoachPlans: () => api.get("/api/coach/plans"),
  createCoachPlan: (payload) => api.post("/api/coach/plan", payload),
  updateCoachPlan: (planId, payload) => api.put(`/api/coach/plan/${planId}`, payload),
  deleteCoachPlan: (planId) => api.delete(`/api/coach/plan/${planId}`),

  // Admin pages currently reuse the available backend plan endpoints.
  getAdminDietPlans: () => api.get("/api/coach/plans"),
  createAdminDietPlan: (payload) => api.post("/api/coach/plan", payload),
  updateAdminDietPlan: (planId, payload) => api.put(`/api/coach/plan/${planId}`, payload),
  deleteAdminDietPlan: (planId) => api.delete(`/api/coach/plan/${planId}`),

  getAdminMeals: () => api.get("/api/meals"),
  searchAdminMeals: (_searchTerm) => api.get("/api/meals"),
  createAdminMeal: (payload) => api.post("/api/admin/meals", payload),
  updateAdminMeal: (mealId, payload) => api.put(`/api/admin/meals/${mealId}`, payload),
  deleteAdminMeal: (mealId) => api.delete(`/api/admin/meals/${mealId}`),

  getSubscriptionPlans: () => api.get("/api/subscription/plans"),
  getCurrentSubscription: () => api.get("/api/subscription/current"),
  getSubscriptionStatus: () => api.get("/api/subscription/status"),
  checkPlanAccess: (plan) => api.get(`/api/subscription/check-access/${plan}`),
  checkFeatureAccess: (feature) => api.get(`/api/subscription/check-feature/${feature}`),
  createRazorpayOrder: (planType) => api.post("/api/subscription/razorpay/order", { plan: planType }),
  verifyRazorpayPayment: (payload) => api.post("/api/subscription/razorpay/verify", payload),

  getAllUsers: (page = 0, size = 10) => api.get(`/api/admin/users?page=${page}&size=${size}`),
  createAdminUser: (userData) => api.post("/api/admin/users", userData),
  updateAdminUser: (userId, userData) => api.put(`/api/admin/users/${userId}`, userData),
  deleteAdminUser: (userId) => api.delete(`/api/admin/users/${userId}`),
  getAnalytics: () => api.get("/api/admin/dashboard"),

  getAdminSubscriptions: () => api.get("/api/subscription/admin/subscriptions"),
  getAdminPayments: () => api.get("/api/subscription/admin/payments")
};

export default api;
