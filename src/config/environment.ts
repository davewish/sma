/**
 * Environment configuration
 */

export const ENV = {
  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  API_TIMEOUT: import.meta.env.VITE_API_TIMEOUT || 30000,
  NODE_ENV: import.meta.env.MODE,
  DEV: import.meta.env.DEV,
  PROD: import.meta.env.PROD,
};

export default ENV;
