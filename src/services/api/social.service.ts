/**
 * Social Connection Service - API calls for social media account connections
 */

import { apiClient } from "./client";
import ENV from "@/config/environment";

export interface SocialAccount {
  _id?: string;
  userId?: string;
  platform: "facebook" | "instagram" | "tiktok" | "twitter";
  accountId?: string;
  accountName: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt: string;
  connectedAt: string;
  followers?: number;
  lastSyncedAt?: string;
  profilePicture?: string;
  verified?: boolean;
  profileData?: {
    profilePicture?: string;
    followers?: number;
    verified?: boolean;
  };
}

interface SocialAccountsResponse {
  accounts: SocialAccount[];
}

export const socialService = {
  /**
   * Get all connected social accounts for the user
   */
  async getConnectedAccounts(): Promise<SocialAccount[]> {
    const response = await apiClient.get<
      SocialAccountsResponse | SocialAccount[]
    >("/social/accounts");
    if (!response?.data) {
      throw new Error("Invalid response from server");
    }

    // Handle both response formats: wrapped in accounts property or direct array
    let accounts: SocialAccount[];
    if (Array.isArray(response.data)) {
      accounts = response.data;
    } else if ((response.data as SocialAccountsResponse).accounts) {
      accounts = (response.data as SocialAccountsResponse).accounts;
    } else {
      throw new Error("Invalid response structure");
    }

    return accounts;
  },

  /**
   * Get OAuth URL for initiating connection
   */
  getOAuthUrl(platform: string): string {
    return `${ENV.API_BASE_URL}/social/connect/${platform}`;
  },

  /**
   * Initiate OAuth connection
   */
  async initiateOAuthConnection(
    platform: string,
  ): Promise<{ redirectUrl: string }> {
    const response = await apiClient.get<{ redirectUrl: string }>(
      `/social/connect/${platform}`,
    );
    if (!response?.data?.redirectUrl) {
      throw new Error("Invalid response from server");
    }
    return response.data;
  },

  /**
   * Disconnect a social media account
   */
  async disconnectAccount(platform: string): Promise<void> {
    await apiClient.delete(`/social/disconnect/${platform}`);
  },

  /**
   * Refresh access token for a social account
   */
  async refreshAccountToken(accountId: string): Promise<SocialAccount> {
    const response = await apiClient.post<SocialAccount>(
      `/social/accounts/${accountId}/refresh`,
    );
    if (!response?.data) {
      throw new Error("Invalid response from server");
    }
    return response.data;
  },

  /**
   * Get details for a specific social account
   */
  async getAccountDetails(accountId: string): Promise<SocialAccount> {
    const response = await apiClient.get<SocialAccount>(
      `/social/accounts/${accountId}`,
    );
    if (!response?.data) {
      throw new Error("Invalid response from server");
    }
    return response.data;
  },

  /**
   * Initiate OAuth connection flow
   */
  initiateOAuthFlow(platform: string): void {
    const clientId = import.meta.env[
      `VITE_${platform.toUpperCase()}_CLIENT_ID`
    ];
    const redirectUri = `${window.location.origin}/api/social/callback/${platform}`;

    const authUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=pages_manage_metadata,pages_read_engagement,instagram_basic,instagram_manage_insights`,
      instagram: `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user_profile,user_media`,
      twitter: `https://twitter.com/i/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=tweet.read,follows.read,follows.write`,
      tiktok: `https://www.tiktok.com/v1/oauth/authorize?client_key=${clientId}&redirect_uri=${redirectUri}&scope=user.info.basic,video.list`,
    };

    const authUrl = authUrls[platform];
    if (!authUrl) {
      throw new Error(`Unsupported platform: ${platform}`);
    }

    window.location.href = authUrl;
  },
};
