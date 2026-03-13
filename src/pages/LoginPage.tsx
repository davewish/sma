/**
 * LoginPage - Email/Password and OAuth login
 */

import { useState } from "react";
import { useAuth } from "@/hooks";
import { Button } from "@/components/common";
import "@/styles/login.css";

interface LoginPageProps {
  onNavigateToLanding?: () => void;
}

export function LoginPage({ onNavigateToLanding }: LoginPageProps) {
  const { login, isLoading, error, clearError } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: "admin@demo.com",
    password: "admin",
    name: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();

    try {
      if (isSignUp) {
        // TODO: Implement signup when available
        console.log("Sign up not yet implemented");
        // await signup({ ...formData });
      } else {
        await login({
          email: formData.email,
          password: formData.password,
        });
      }
    } catch {
      // Error is handled by context and displayed in UI
    }
  };

  const handleOAuthLogin = async (provider: string) => {
    clearError();
    try {
      // TODO: Implement OAuth flow based on provider
      // This would typically involve redirecting to OAuth provider
      // and handling the callback
      console.log(`${provider} OAuth flow would be initiated`);
      // await loginWithOAuth(provider, authCode);
    } catch {
      // Error is handled by context
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>{isSignUp ? "Create Account" : "Login"}</h1>

        {!isSignUp && (
          <div className="demo-hint">
            Demo credentials: admin@demo.com / admin
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          {isSignUp && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="John Doe"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="admin@demo.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="admin"
              required
            />
          </div>

          <Button type="submit" disabled={isLoading} className="login-button">
            {isLoading ? "Processing..." : isSignUp ? "Sign Up" : "Login"}
          </Button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <div className="oauth-buttons">
          <button
            type="button"
            className="oauth-button google"
            onClick={() => handleOAuthLogin("google")}
            disabled={isLoading}
          >
            <span className="oauth-icon">🔵</span>
            Login with Google
          </button>
        </div>

        <div className="login-footer">
          <p>
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <button
              type="button"
              className="toggle-button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                clearError();
              }}
              disabled={isLoading}
            >
              {isSignUp ? "Login" : "Sign Up"}
            </button>
          </p>
          <p className="back-to-landing">
            <button
              type="button"
              className="back-button"
              onClick={onNavigateToLanding}
              disabled={isLoading}
            >
              ← Back to Home
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
