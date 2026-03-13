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

    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: unknown) => {
        if (axios.isAxiosError(error)) {
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
