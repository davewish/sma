/**
 * Authentication Service - API calls for authentication
 */

import type {
  LoginCredentials,
  SignUpCredentials,
  AuthResponse,
  AuthUser,
} from "@/types/auth.types";

export const authService = {
  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Default credentials for demo
    if (
      credentials.email === "admin@demo.com" &&
      credentials.password === "admin"
    ) {
      const user: AuthUser = {
        id: "1",
        email: "admin@demo.com",
        name: "Admin User",
      };
      return {
        token: "demo_token_" + Date.now(),
        user,
        refreshToken: "demo_refresh_token_" + Date.now(),
      };
    }

    throw new Error(
      "Invalid email or password. Use admin@demo.com / admin to login.",
    );
  },

  /**
   * Sign up with email, password, and name
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async signup(_credentials: SignUpCredentials): Promise<AuthResponse> {
    // TODO: Implement signup when backend is ready
    throw new Error("Sign up not yet implemented");
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async refreshToken(_refreshToken: string): Promise<AuthResponse> {
    // TODO: Implement token refresh when backend is ready
    throw new Error("Token refresh not yet implemented");
  },

  /**
   * Logout - clear server session
   */
  async logout(): Promise<void> {
    // TODO: Call logout endpoint on backend if needed
  },

  /**
   * Verify current token
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async verifyToken(_token: string): Promise<boolean> {
    // TODO: Implement token verification when backend is ready
    return true;
  },
};
