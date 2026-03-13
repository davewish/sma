/**
 * OAuth Configuration for social media platforms
 */

import type { OAuthConfig, OAuthProvider } from "@/types/oauth.types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const APP_URL = import.meta.env.VITE_APP_URL || "http://localhost:5174";

export const OAUTH_CONFIGS: Record<OAuthProvider, OAuthConfig> = {
  facebook: {
    clientId: import.meta.env.VITE_FACEBOOK_APP_ID || "YOUR_FACEBOOK_APP_ID",
    redirectUri: `${APP_URL}/auth/callback/facebook`,
    authorizationUrl: "https://www.facebook.com/v18.0/dialog/oauth",
    tokenUrl: `${API_BASE_URL}/auth/token/facebook`,
    scope: [
      "public_profile",
      "email",
      "pages_read_engagement",
      "pages_read_user_content",
      "instagram_basic",
    ],
  },
  instagram: {
    clientId: import.meta.env.VITE_INSTAGRAM_APP_ID || "YOUR_INSTAGRAM_APP_ID",
    redirectUri: `${APP_URL}/auth/callback/instagram`,
    authorizationUrl: "https://api.instagram.com/oauth/authorize",
    tokenUrl: `${API_BASE_URL}/auth/token/instagram`,
    scope: ["user_profile", "instagram_business_account_management"],
  },
  tiktok: {
    clientId:
      import.meta.env.VITE_TIKTOK_CLIENT_KEY || "YOUR_TIKTOK_CLIENT_KEY",
    redirectUri: `${APP_URL}/auth/callback/tiktok`,
    authorizationUrl: "https://www.tiktok.com/v1/oauth/authorize",
    tokenUrl: `${API_BASE_URL}/auth/token/tiktok`,
    scope: ["user.info.basic", "video.list"],
  },
};

/**
 * Generate OAuth authorization URL for a platform
 */
export function generateOAuthUrl(platform: OAuthProvider): string {
  const config = OAUTH_CONFIGS[platform];
  const state = generateRandomState();

  // Store state in sessionStorage for validation
  sessionStorage.setItem(
    `oauth_state_${platform}`,
    JSON.stringify({
      state,
      timestamp: Date.now(),
    }),
  );

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: "code",
    scope: config.scope.join(" "),
    state,
  });

  return `${config.authorizationUrl}?${params.toString()}`;
}

/**
 * Generate random state for OAuth security
 */
function generateRandomState(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

/**
 * Validate OAuth state
 */
export function validateOAuthState(
  platform: OAuthProvider,
  state: string,
): boolean {
  const storedState = sessionStorage.getItem(`oauth_state_${platform}`);
  if (!storedState) {
    return false;
  }

  try {
    const { state: savedState, timestamp } = JSON.parse(storedState);
    // State is valid for 10 minutes
    if (Date.now() - timestamp > 10 * 60 * 1000) {
      return false;
    }
    return savedState === state;
  } catch {
    return false;
  }
}

/**
 * Clear OAuth state
 */
export function clearOAuthState(platform: OAuthProvider): void {
  sessionStorage.removeItem(`oauth_state_${platform}`);
}
