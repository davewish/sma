/**
 * API-related types and interfaces
 */

export interface ApiResponse<T = unknown> {
  status: number;
  message: string;
  data?: T;
  error?: string;
}

export interface ApiError {
  code: string;
  message: string;
  status: number;
}

export interface ApiRequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  timeout?: number;
}
