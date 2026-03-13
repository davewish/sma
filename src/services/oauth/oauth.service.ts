/**
 * OAuth Service - Handles OAuth flows for social media platforms
 */

import {
  generateOAuthUrl,
  validateOAuthState,
  clearOAuthState,
} from "./oauth.config";
import type { OAuthProvider, PlatformAccount } from "@/types/oauth.types";

function createMockAccount(platform: OAuthProvider): PlatformAccount {
  const mockAccounts = {
    facebook: {
      id: "facebook_" + Date.now(),
      platform: "facebook" as OAuthProvider,
      username: "Your Business Page",
      email: "admin@demo.com",
      followers: 12500,
      profileImage:
        "https://via.placeholder.com/50?text=Facebook&bg=1877F2&color=ffffff",
      accessToken: "fb_access_token_" + Date.now(),
      refreshToken: "fb_refresh_token_" + Date.now(),
      tokenExpiry: Date.now() + 60 * 24 * 60 * 60 * 1000, // 60 days
      connectedAt: new Date().toISOString(),
    },
    instagram: {
      id: "instagram_" + Date.now(),
      platform: "instagram" as OAuthProvider,
      username: "your_instagram_handle",
      followers: 8300,
      profileImage:
        "https://via.placeholder.com/50?text=Instagram&bg=E4405F&color=ffffff",
      accessToken: "ig_access_token_" + Date.now(),
      refreshToken: "ig_refresh_token_" + Date.now(),
      tokenExpiry: Date.now() + 60 * 24 * 60 * 60 * 1000,
      connectedAt: new Date().toISOString(),
    },
    tiktok: {
      id: "tiktok_" + Date.now(),
      platform: "tiktok" as OAuthProvider,
      username: "your_tiktok_handle",
      followers: 15600,
      profileImage:
        "https://via.placeholder.com/50?text=TikTok&bg=000000&color=25f4ee",
      accessToken: "tt_access_token_" + Date.now(),
      connectedAt: new Date().toISOString(),
    },
  };

  return mockAccounts[platform] as PlatformAccount;
}

export const oauthService = {
  /**
   * Redirect to OAuth provider authorization page
   */
  initiateOAuthFlow(platform: OAuthProvider): void {
    try {
      const authUrl = generateOAuthUrl(platform);
      window.location.href = authUrl;
    } catch (error) {
      console.error(`Failed to initiate ${platform} OAuth flow:`, error);
      throw new Error(`Could not connect to ${platform}`);
    }
  },

  /**
   * Handle OAuth callback and exchange code for token
   */
  async handleOAuthCallback(
    platform: OAuthProvider,
    _code: string,
    state: string,
  ): Promise<PlatformAccount> {
    // Validate state for security
    if (!validateOAuthState(platform, state)) {
      clearOAuthState(platform);
      throw new Error("Invalid OAuth state. Authentication failed.");
    }

    // Clear the state after validation
    clearOAuthState(platform);

    try {
      // For demo purposes, we'll create mock account data
      // In production, this would exchange the code for a token via backend
      return createMockAccount(platform);
    } catch (error) {
      throw new Error(
        `Failed to authenticate with ${platform}: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  },

  /**
   * Refresh expired access token
   */
  async refreshAccessToken(
    platform: OAuthProvider,
  ): Promise<{ accessToken: string; expiresIn: number }> {
    // TODO: Implement token refresh with backend
    console.log(`Refreshing ${platform} token`);
    return {
      accessToken: `new_${platform}_token_` + Date.now(),
      expiresIn: 60 * 24 * 60 * 60, // 60 days
    };
  },

  /**
   * Revoke access token (disconnect account)
   */
  async revokeAccessToken(platform: OAuthProvider): Promise<void> {
    // TODO: Implement token revocation with backend
    console.log(`Revoking ${platform} token`);
  },
};
