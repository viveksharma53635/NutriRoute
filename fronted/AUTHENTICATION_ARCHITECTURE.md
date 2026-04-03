# NutriRoute Authentication Architecture

## 📁 Folder Structure

```
src/
├── components/
│   ├── Navbar.jsx              # Role-based navigation component
│   ├── Navbar.css               # Glassmorphism styling
│   ├── Layout.jsx               # Main layout wrapper
│   └── RoleBasedRoute.jsx       # Role protection component
├── context/
│   └── LoginContext.jsx         # Authentication state management
├── pages/
│   ├── ProtectedRoute.jsx       # Basic authentication guard
│   ├── SignIn.jsx               # Login page with role-based redirect
│   ├── Dashboard.jsx            # User dashboard
│   ├── AdminDashboardPage.jsx   # Admin dashboard
│   └── ...                      # Other pages
├── App.jsx                      # Main routing configuration
└── main.jsx                     # Application entry point
```

## 🔐 Authentication Flow

### 1. Login Process
- User submits credentials to `/auth/login`
- Backend returns user data with role and JWT token
- `LoginContext.login()` stores user data and token
- Role-based redirect:
  - `ROLE_ADMIN` → `/admin/dashboard`
  - `ROLE_USER` → `/dashboard`

### 2. Route Protection
- **ProtectedRoute**: Basic authentication check
- **RoleBasedRoute**: Role-specific access control
- Automatic redirect to appropriate dashboard if wrong role

### 3. Navigation Structure

#### Public (Logged Out)
- Home
- Login

#### User (Logged In - ROLE_USER)
- Home
- Dashboard
- Diet Planner
- Healthy Menus
- Track Progress
- Profile dropdown

#### Admin (Logged In - ROLE_ADMIN)
- Dashboard
- User Management
- Meal Management
- Analytics
- Profile dropdown

## 🛡️ Security Features

1. **Context-based Authentication**: Centralized state management
2. **Role-based Access Control**: Different navigation and routes
3. **Automatic Redirects**: Users can't access wrong role pages
4. **Loading States**: Smooth UX during auth checks
5. **Token Management**: Secure localStorage handling

## 🎯 Key Components

### LoginContext
```javascript
// Helper functions
- hasRole(role)          // Check specific role
- isAdmin()              // Check admin role
- isUser()               // Check user role
- getUserRole()          // Get current role
- login(userData, token) // Authenticate user
- logout()               // Clear session
```

### RoleBasedRoute
```javascript
// Props
- requiredRole           // Specific role requirement
- adminRoute            // Admin-only route shortcut
- children              // Protected content
```

### Navigation Logic
```javascript
// Conditional rendering based on authentication and role
!isAuthenticated     → Public navigation
isAdmin()           → Admin navigation  
isUser()            → User navigation
```

## 🔄 URL Redirects

| Scenario | From | To |
|-----------|------|----|
| User tries `/admin/*` | Any admin route | `/dashboard` |
| Admin tries `/dashboard` | User dashboard | `/admin/dashboard` |
| Unauthenticated | Any protected route | `/login` |
| Login success | - | Role-based dashboard |

## 🎨 UI Features

- **Glassmorphism navbar** with blur effects
- **Role-based icons** and navigation items
- **Smooth transitions** and hover effects
- **Mobile responsive** design
- **Bootstrap 5** components
- **Professional color scheme** (green health theme)

## 🚀 Usage Examples

### Protecting Admin Routes
```jsx
<Route
  path="admin/users"
  element={
    <RoleBasedRoute adminRoute={true}>
      <UserManagement />
    </RoleBasedRoute>
  }
/>
```

### Checking User Role in Components
```jsx
const { isAdmin, isUser } = useContext(LoginContext);

if (isAdmin()) {
  // Admin-specific logic
}
```

### Conditional Navigation
```jsx
{isAdmin() && (
  <li className="nav-item">
    <Link to="/admin/users">User Management</Link>
  </li>
)}
```

This architecture provides a scalable, secure foundation for role-based authentication in professional SaaS applications.
