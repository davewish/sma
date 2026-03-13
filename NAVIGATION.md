/**
 * Navigation Integration Guide
 * 
 * How the Login page is integrated with the Landing page
 */

# Navigation & Login Integration

## How It Works

The application now has a simple page-based navigation system that switches between:
1. **Landing Page** - Marketing page with features, pricing, and CTA
2. **Login Page** - Email/password and OAuth login interface

## Navigation Flow

### From Landing Page to Login
- Click **"Login"** button in the navigation bar
- Click **"Start Free Trial"** button in the hero section
- Both navigate to the LoginPage

### From Login Page back to Landing
- Click **"← Back to Home"** button at the bottom of the login card
- Returns to the LandingPage

### After Successful Login
- When user successfully logs in, you can update the App.tsx to redirect to a Dashboard or HomePage
- Current implementation: stays on login page (ready for next step)

## File Structure

```
src/
├── App.tsx                 # Main router component
├── pages/
│   ├── LandingPage.tsx     # Marketing landing page
│   ├── LoginPage.tsx       # Authentication page
│   └── index.ts            # Page exports
├── styles/
│   ├── landing.css         # Landing page styles
│   └── login.css           # Login page styles
└── context/
    └── AuthContext.tsx     # Auth state management
```

## App.tsx Structure

```tsx
function App() {
  const [currentPage, setCurrentPage] = useState<Page>("landing");

  return (
    <AuthProvider>
      {currentPage === "landing" && (
        <LandingPage onNavigateToLogin={() => setCurrentPage("login")} />
      )}
      {currentPage === "login" && (
        <LoginPage onNavigateToLanding={() => setCurrentPage("landing")} />
      )}
    </AuthProvider>
  );
}
```

## Component Props

### LandingPage
```tsx
interface LandingPageProps {
  onNavigateToLogin?: () => void;
}
```

### LoginPage
```tsx
interface LoginPageProps {
  onNavigateToLanding?: () => void;
}
```

## Next Steps

To add dashboard navigation after login:

1. Create a `HomePage.tsx` or `DashboardPage.tsx`
2. Update App.tsx to add a new page state
3. In LoginPage, after successful login, navigate to dashboard:

```tsx
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  try {
    await login({...});
    onNavigateToLanding?.(); // Change this to navigate to dashboard
  } catch {
    // Handle error
  }
};
```

## Styling

- Landing page styles: `src/styles/landing.css`
- Login page styles: `src/styles/login.css`
- Global styles: `src/styles/global.css`
- Component styles: Individual CSS files in component directories

## Pages Available

- ✅ **LandingPage** - Marketing/home page
- ✅ **LoginPage** - Authentication page
- 📋 **HomePage** (created but not integrated)
  - Ready to use when dashboard is ready
