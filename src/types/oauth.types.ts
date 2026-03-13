/**
 * OAuth Types - Social media platform authentication
 */

export type OAuthProvider = "facebook" | "instagram" | "tiktok";

export interface OAuthConfig {
  clientId: string;
  clientSecret?: string;
  redirectUri: string;
  authorizationUrl: string;
  tokenUrl: string;
  scope: string[];
}

export interface OAuthState {
  state: string;
  platform: OAuthProvider;
  timestamp: number;
}

export interface OAuthCallbackParams {
  code: string;
  state: string;
}

export interface PlatformAccount {
  id: string;
  platform: OAuthProvider;
  username: string;
  email?: string;
  followers: number;
  profileImage?: string;
  accessToken: string;
  refreshToken?: string;
  tokenExpiry?: number;
  connectedAt: string;
}

export interface OAuthError {
  code: string;
  message: string;
  details?: string;
}
