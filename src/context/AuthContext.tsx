/**
 * Authentication Provider - Manages global authentication state
 */

import { useCallback, useEffect, useState } from "react";
import { AuthContext } from "./authContext";
import type {
  AuthState,
  LoginCredentials,
  SignUpCredentials,
} from "@/types/auth.types";
import { authService } from "@/services/api/auth.service";
import { authManager } from "@/services/api/auth-manager";

const STORAGE_KEYS = {
  TOKEN: "auth_token",
  REFRESH_TOKEN: "auth_refresh_token",
  USER: "auth_user",
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const userStr = localStorage.getItem(STORAGE_KEYS.USER);

      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          setState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return;
        } catch {
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);
        }
      }
      setState((prev) => ({ ...prev, isLoading: false }));
    };

    initializeAuth();

    // Listen for token expiration via localStorage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.TOKEN && !e.newValue) {
        // Token was removed
        console.log("Token removed, logging out");
        setState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: "Session expired. Please log in again.",
        });
      }

      // Also check for the __token_expired__ flag
      if (e.key === "__token_expired__") {
        console.log("Token expiration flag detected");
        setState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: "Session expired. Please log in again.",
        });
      }
    };

    // Listen for token expiration events from API interceptor
    const handleTokenExpired = () => {
      console.log("Token expired event received");
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: "Session expired. Please log in again.",
      });
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("auth-token-expired", handleTokenExpired);

    // Register logout callback with AuthManager
    const handleAuthManagerLogout = () => {
      console.log("AuthManager logout callback triggered");
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: "Session expired. Please log in again.",
      });
    };

    authManager.onLogoutRequired(handleAuthManagerLogout);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth-token-expired", handleTokenExpired);
      authManager.removeLogoutCallback(handleAuthManagerLogout);
    };
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await authService.login(credentials);

      if (response.token && response.user) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
        if (response.refreshToken) {
          localStorage.setItem(
            STORAGE_KEYS.REFRESH_TOKEN,
            response.refreshToken,
          );
        }

        setState({
          user: response.user,
          token: response.token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  const signup = useCallback(async (credentials: SignUpCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await authService.signup(credentials);

      if (response.token && response.user) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
        if (response.refreshToken) {
          localStorage.setItem(
            STORAGE_KEYS.REFRESH_TOKEN,
            response.refreshToken,
          );
        }

        setState({
          user: response.user,
          token: response.token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Sign up failed";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      // Call logout API before clearing localStorage (so token is still available)
      await authService.logout();
    } catch (error) {
      console.error("Logout API error:", error);
      // Continue with local cleanup even if API request fails
    } finally {
      // Clear local storage and state
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  }, []);

  const loginWithOAuth = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (provider: string, _authCode: string) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const response = await authService.loginWithOAuth(provider);

        if (response.token && response.user) {
          localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
          localStorage.setItem(
            STORAGE_KEYS.USER,
            JSON.stringify(response.user),
          );
          if (response.refreshToken) {
            localStorage.setItem(
              STORAGE_KEYS.REFRESH_TOKEN,
              response.refreshToken,
            );
          }

          setState({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : `${provider} login failed`;
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
        throw error;
      }
    },
    [],
  );

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signup,
        logout,
        clearError,
        loginWithOAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
