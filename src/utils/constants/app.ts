/**
 * App constants
 */

export const APP_NAME = "My React App";

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const API_ENDPOINTS = {
  // Add your API endpoints here
  // USERS: '/users',
  // PRODUCTS: '/products',
} as const;
