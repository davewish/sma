/**
 * API Client - Centralized HTTP client for all API requests using Axios
 */

import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import type { ApiError, ApiRequestConfig, ApiResponse } from "@/types";
import ENV from "@/config/environment";

// Mock data for development
const mockPosts = [
  {
    id: "post-1",
    accountId: "fb-1",
    platform: "facebook" as const,
    content:
      "Check out our latest product launch! 🚀 Available now on all platforms.",
    scheduledTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: "published" as const,
    engagement: {
      likes: 2840,
      comments: 156,
      shares: 89,
    },
  },
  {
    id: "post-2",
    accountId: "ig-1",
    platform: "instagram" as const,
    content:
      "Beautiful sunset with our community. Thanks for the amazing support!",
    scheduledTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: "published" as const,
    engagement: {
      likes: 5320,
      comments: 234,
      shares: 145,
    },
  },
  {
    id: "post-3",
    accountId: "tt-1",
    platform: "tiktok" as const,
    content:
      "POV: You just discovered the best trending sound 🎵 #viral #trending",
    scheduledTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: "published" as const,
    engagement: {
      likes: 12540,
      comments: 876,
      shares: 2340,
    },
  },
  {
    id: "post-4",
    accountId: "fb-1",
    platform: "facebook" as const,
    content: "Join us for our weekly live Q&A session! Thursday at 3 PM EST",
    scheduledTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: "published" as const,
    engagement: {
      likes: 1240,
      comments: 89,
      shares: 34,
    },
  },
];

const mockAccounts = [
  {
    id: "fb-1",
    platform: "facebook" as const,
    username: "mybrand",
    followers: 5200,
    isConnected: true,
  },
  {
    id: "ig-1",
    platform: "instagram" as const,
    username: "mybrand.official",
    followers: 12400,
    isConnected: true,
  },
  {
    id: "tt-1",
    platform: "tiktok" as const,
    username: "@mybrand",
    followers: 45600,
    isConnected: true,
  },
];

const mockStats = {
  totalFollowers: 63200,
  postsThisMonth: 24,
  engagementRate: 8.5,
  accounts: mockAccounts,
  upcomingPosts: mockPosts,
};

export class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor(
    baseURL: string = ENV.API_BASE_URL,
    timeout: number = ENV.API_TIMEOUT,
  ) {
    this.axiosInstance = axios.create({
      baseURL,
      timeout,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Response interceptor for error handling and mock data
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: unknown) => {
        if (axios.isAxiosError(error)) {
          // For mock/development, intercept specific endpoints and return mock data
          if (error.config?.url?.includes("/dashboard/stats")) {
            return Promise.resolve({
              data: mockStats,
            } as AxiosResponse);
          }
          if (error.config?.url?.includes("/dashboard/accounts")) {
            return Promise.resolve({
              data: mockAccounts,
            } as AxiosResponse);
          }
          if (error.config?.url?.includes("/dashboard/posts/upcoming")) {
            return Promise.resolve({
              data: mockPosts,
            } as AxiosResponse);
          }

          if (error.response) {
            // Server responded with error status
            throw {
              code: "API_ERROR",
              message:
                (error.response.data as Record<string, unknown>)?.message ||
                "An error occurred",
              status: error.response.status,
            } as ApiError;
          } else if (error.request) {
            // Request made but no response
            throw {
              code: "NETWORK_ERROR",
              message: "Network request failed",
              status: 0,
            } as ApiError;
          }
        }
        // Error in request setup
        const message =
          error instanceof Error ? error.message : "Request setup failed";
        throw {
          code: "REQUEST_ERROR",
          message,
          status: 0,
        } as ApiError;
      },
    );
  }

  private async request<T>(
    endpoint: string,
    options?: AxiosRequestConfig & ApiRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.request<ApiResponse<T>>({
      url: endpoint,
      ...options,
      params: options?.params,
      headers: options?.headers,
    });

    return response.data;
  }

  async get<T>(
    endpoint: string,
    config?: ApiRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "GET" });
  }

  async post<T>(
    endpoint: string,
    body?: unknown,
    config?: ApiRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: "POST",
      data: body,
    });
  }

  async put<T>(
    endpoint: string,
    body?: unknown,
    config?: ApiRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: "PUT",
      data: body,
    });
  }

  async patch<T>(
    endpoint: string,
    body?: unknown,
    config?: ApiRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...config,
      method: "PATCH",
      data: body,
    });
  }

  async delete<T>(
    endpoint: string,
    config?: ApiRequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
