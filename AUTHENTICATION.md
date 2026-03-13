/**
 * Authentication Feature Documentation
 * 
 * This document describes the authentication system implemented in the project.
 */

# Authentication Feature

The project now includes a complete authentication system supporting both email/password and OAuth login.

## Files Created

### Types
- **`src/types/auth.types.ts`** - Authentication types and interfaces
  - `LoginCredentials` - Email and password for login
  - `SignUpCredentials` - Email, password, and name for signup
  - `AuthResponse` - Server response with token and user data
  - `AuthUser` - User information
  - `AuthState` - Current authentication state
  - `AuthContextType` - Authentication context interface

### Services
- **`src/services/api/auth.service.ts`** - API calls for authentication
  - `login()` - Email/password login
  - `signup()` - Create new account
  - `loginWithOAuth()` - OAuth provider login
  - `refreshToken()` - Refresh expired token
  - `logout()` - Clear server session
  - `verifyToken()` - Verify current token validity

### Context & State Management
- **`src/context/authContext.ts`** - React context for authentication
- **`src/context/AuthContext.tsx`** - AuthProvider component
  - Manages global authentication state
  - Persists auth data in localStorage
  - Provides login, signup, logout methods

### Hooks
- **`src/hooks/useAuth.ts`** - Custom hook to access auth context
  - Must be used within AuthProvider

### Pages
- **`src/pages/LoginPage.tsx`** - Login/Signup page
  - Email/password login form
  - OAuth buttons (Google, GitHub, Microsoft)
  - Toggle between login and signup modes

### Styles
- **`src/styles/login.css`** - Login page styles

## Usage

### 1. Setup - Wrap your app with AuthProvider

```tsx
import { AuthProvider } from "@/context/AuthContext";
import { App } from "./App";

function Root() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
```

### 2. Access authentication in components

```tsx
import { useAuth } from "@/hooks";

function MyComponent() {
  const { user, isAuthenticated, login, logout, error } = useAuth();

  return (
    <>
      {isAuthenticated ? (
        <>
          <p>Welcome, {user?.name}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={() => login({ email: "...", password: "..." })}>
          Login
        </button>
      )}
      {error && <p className="error">{error}</p>}
    </>
  );
}
```

### 3. Handle login/signup

```tsx
import { useAuth } from "@/hooks";

function LoginForm() {
  const { login, signup, isLoading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      // User is logged in, redirect to home
    } catch (err) {
      // Error is displayed via error state
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {error && <div className="error">{error}</div>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
```

## Backend API Endpoints Required

The frontend expects the following API endpoints:

### Authentication Endpoints

**POST `/auth/login`**
- Request: `{ email: string, password: string }`
- Response: `{ token: string, refreshToken?: string, user: { id, email, name } }`

**POST `/auth/signup`**
- Request: `{ email: string, password: string, name: string }`
- Response: `{ token: string, refreshToken?: string, user: { id, email, name } }`

**POST `/auth/oauth/:provider`**
- Request: `{ code: string }`
- Response: `{ token: string, refreshToken?: string, user: { id, email, name } }`
- Supported providers: google, github, microsoft

**POST `/auth/refresh`**
- Request: `{ refreshToken: string }`
- Response: `{ token: string, user: { id, email, name } }`

**POST `/auth/logout`**
- Request: `{}`
- Response: `{}`

**GET `/auth/verify`**
- Headers: `Authorization: Bearer <token>`
- Response: `{ valid: boolean }`

## Storage

Authentication data is persisted in localStorage:
- `auth_token` - JWT token
- `auth_refresh_token` - Refresh token
- `auth_user` - User object JSON

## State Structure

```typescript
{
  user: AuthUser | null,           // Current user info
  token: string | null,            // JWT token
  isAuthenticated: boolean,        // Login status
  isLoading: boolean,              // API call in progress
  error: string | null,            // Error message
  
  // Methods
  login(credentials): Promise<void>,
  signup(credentials): Promise<void>,
  logout(): void,
  clearError(): void,
  loginWithOAuth(provider, code): Promise<void>
}
```

## OAuth Implementation Notes

The OAuth implementation is currently a placeholder. To implement full OAuth:

1. **Google OAuth**
   - Use `google-auth-library-for-js`
   - Implement Google Sign-In button
   - Handle authorization code flow

2. **GitHub OAuth**
   - Redirect to GitHub authorization URL
   - Handle callback with authorization code
   - Exchange code for token

3. **Microsoft OAuth**
   - Use MSAL (Microsoft Authentication Library)
   - Implement Microsoft Sign-In button
   - Handle token acquisition

## Next Steps

1. Implement OAuth flows for each provider
2. Add token refresh logic on 401 responses
3. Add password reset functionality
4. Add email verification
5. Implement account settings/profile page
6. Add multi-factor authentication (MFA)
7. Add user registration validation
8. Implement protected routes
