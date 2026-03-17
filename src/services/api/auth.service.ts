/**
 * Authentication Service - API calls for authentication
 */

import { apiClient } from "./client";
import type {
  LoginCredentials,
  SignUpCredentials,
  AuthResponse,
} from "@/types/auth.types";

export const authService = {
  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>("/auth/login", {
        email: credentials.email,
        password: credentials.password,
      });

      if (!response?.data) {
        throw new Error("Invalid response from server");
      }

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message || "Login failed");
      }
      throw new Error("Login failed");
    }
  },

  /**
   * Sign up with email, password, and name
   */
  async signup(credentials: SignUpCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>("/auth/register", {
        email: credentials.email,
        password: credentials.password,
        confirmPassword: credentials.passwordConfirm || credentials.password,
        name: credentials.name,
      });

      if (!response?.data) {
        throw new Error("Invalid response from server");
      }

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message || "Sign up failed");
      }
      throw new Error("Sign up failed");
    }
  },

  /**
   * Login with OAuth provider
   */
  async loginWithOAuth(provider: string): Promise<AuthResponse> {
    // TODO: Implement OAuth flow
    throw new Error(`${provider} OAuth not yet implemented`);
  },

  /**
   * Refresh authentication token
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>("/auth/refresh", {
        refreshToken,
      });

      if (!response?.data) {
        throw new Error("Invalid response from server");
      }

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message || "Token refresh failed");
      }
      throw new Error("Token refresh failed");
    }
  },

  /**
   * Logout - clear server session
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout", {});
    } catch (error) {
      console.error("Logout error:", error);
      // Don't throw on logout to allow local cleanup even if server request fails
    }
  },

  /**
   * Verify current token
   */
  async verifyToken(token: string): Promise<boolean> {
    try {
      const response = await apiClient.get<{ valid: boolean }>("/auth/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data?.valid || false;
    } catch (error) {
      console.error("Token verification error:", error);
      return false;
    }
  },
};
