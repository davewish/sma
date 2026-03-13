/**
 * Common types used throughout the application
 */

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}
