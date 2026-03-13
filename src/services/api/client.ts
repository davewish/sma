/**
 * API Client - Centralized HTTP client for all API requests
 */

import { ApiError, ApiRequestConfig, ApiResponse } from "@/types";
import ENV from "@/config/environment";

export class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor(
    baseUrl: string = ENV.API_BASE_URL,
    timeout: number = ENV.API_TIMEOUT,
  ) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit & ApiRequestConfig = {},
  ): Promise<ApiResponse<T>> {
    const url = new URL(
      endpoint.startsWith("http") ? endpoint : `${this.baseUrl}${endpoint}`,
    );

    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    const defaultHeaders: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    try {
      const response = await fetch(url.toString(), {
        ...options,
        headers: defaultHeaders,
        signal: AbortSignal.timeout(this.timeout),
      });

      const data: ApiResponse<T> = await response.json();

      if (!response.ok) {
        throw {
          code: "API_ERROR",
          message: data.message || "An error occurred",
          status: response.status,
        } as ApiError;
      }

      return data;
    } catch (error) {
      if (error instanceof TypeError) {
        throw {
          code: "NETWORK_ERROR",
          message: "Network request failed",
          status: 0,
        } as ApiError;
      }
      throw error;
    }
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
      body: body ? JSON.stringify(body) : undefined,
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
      body: body ? JSON.stringify(body) : undefined,
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
      body: body ? JSON.stringify(body) : undefined,
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
