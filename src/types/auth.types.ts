/**
 * Authentication types and interfaces
 */

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends LoginCredentials {
  name: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: AuthUser;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface OAuthProvider {
  type: "google" | "github" | "microsoft";
  clientId: string;
  redirectUri: string;
}

export interface OAuthConfig {
  google?: OAuthProvider;
  github?: OAuthProvider;
  microsoft?: OAuthProvider;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (credentials: SignUpCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  loginWithOAuth: (provider: string, authCode: string) => Promise<void>;
}
