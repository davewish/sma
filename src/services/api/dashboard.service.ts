/**
 * Dashboard Service - API calls for dashboard data
 */

import { apiClient } from "./client";
import type {
  DashboardStats,
  ConnectedAccount,
  ScheduledPost,
} from "@/types/dashboard.types";

// Backend response types
interface DashboardStatsResponse {
  totalFollowers: number;
  postsThisMonth: number;
  engagementRate: number;
  accounts: ConnectedAccount[];
  upcomingPosts: ScheduledPost[];
}

interface UpcomingPostsResponse {
  posts: ScheduledPost[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export const dashboardService = {
  /**
   * Get dashboard stats and data
   */
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await apiClient.get<DashboardStatsResponse>(
      "/dashboard/stats",
    );
    if (!response.data) {
      throw new Error("Invalid response from server");
    }
    // Return the entire response as DashboardStats
    return {
      totalFollowers: response.data.totalFollowers,
      postsThisMonth: response.data.postsThisMonth,
      engagementRate: response.data.engagementRate,
      accounts: response.data.accounts,
      upcomingPosts: response.data.upcomingPosts,
    };
  },

  /**
   * Get connected accounts
   */
  async getConnectedAccounts(): Promise<ConnectedAccount[]> {
    const response = await apiClient.get<ConnectedAccount[]>(
      "/dashboard/accounts",
    );
    if (!response.data) {
      throw new Error("Invalid response from server");
    }
    return response.data;
  },

  /**
   * Connect a new social media account
   */
  async connectAccount(
    platform: string,
    authCode: string,
  ): Promise<ConnectedAccount> {
    const response = await apiClient.post<ConnectedAccount>(
      `/dashboard/accounts/connect`,
      { platform, code: authCode },
    );
    if (!response.data) {
      throw new Error("Invalid response from server");
    }
    return response.data;
  },

  /**
   * Disconnect an account
   */
  async disconnectAccount(accountId: string): Promise<void> {
    await apiClient.delete(`/dashboard/accounts/${accountId}`);
  },

  /**
   * Get upcoming posts - handles paginated response
   */
  async getUpcomingPosts(): Promise<ScheduledPost[]> {
    const response = await apiClient.get<UpcomingPostsResponse>(
      "/dashboard/posts/upcoming",
    );
    if (!response.data || !response.data.posts) {
      throw new Error("Invalid response from server");
    }
    // Return just the posts array
    return response.data.posts;
  },

  /**
   * Get posts for a specific date
   */
  async getPostsByDate(date: string): Promise<ScheduledPost[]> {
    const response = await apiClient.get<ScheduledPost[]>(
      "/dashboard/posts/date",
      { params: { date } },
    );
    if (!response.data) {
      throw new Error("Invalid response from server");
    }
    return response.data;
  },

  /**
   * Create a new post
   */
  async createPost(post: Omit<ScheduledPost, "id">): Promise<ScheduledPost> {
    const response = await apiClient.post<ScheduledPost>(
      "/dashboard/posts",
      post,
    );
    if (!response.data) {
      throw new Error("Invalid response from server");
    }
    return response.data;
  },

  /**
   * Update a post
   */
  async updatePost(
    postId: string,
    post: Partial<ScheduledPost>,
  ): Promise<ScheduledPost> {
    const response = await apiClient.put<ScheduledPost>(
      `/dashboard/posts/${postId}`,
      post,
    );
    if (!response.data) {
      throw new Error("Invalid response from server");
    }
    return response.data;
  },

  /**
   * Delete a post
   */
  async deletePost(postId: string): Promise<void> {
    await apiClient.delete(`/dashboard/posts/${postId}`);
  },
};
