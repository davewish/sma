/**
 * Dashboard Service - API calls for dashboard data
 */

import { apiClient } from "./client";
import type {
  DashboardStats,
  ConnectedAccount,
  ScheduledPost,
} from "@/types/dashboard.types";

export const dashboardService = {
  /**
   * Get dashboard stats and data
   */
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await apiClient.get<DashboardStats>("/dashboard/stats");
    if (!response.data) {
      throw new Error("Invalid response from server");
    }
    return response.data;
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
   * Get upcoming posts
   */
  async getUpcomingPosts(): Promise<ScheduledPost[]> {
    const response = await apiClient.get<ScheduledPost[]>(
      "/dashboard/posts/upcoming",
    );
    if (!response.data) {
      throw new Error("Invalid response from server");
    }
    return response.data;
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
