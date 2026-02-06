/**
 * AXIOS CLIENT CONFIGURATION
 *
 * Production-ready Axios instance with security best practices:
 * - Automatic token authentication
 * - Secure error handling
 * - CORS handling
 * - Production/Development environment detection
 */
import type { InternalAxiosRequestConfig } from "axios";
import axios, { AxiosError } from "axios";
import { API_URL, API_TIMEOUT, AUTH_TOKEN_KEY } from "../config/constants";

// Create Axios instance with secure configuration
export const axiosClient = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
  withCredentials: true, // Enable credentials for CORS
});

/**
 * REQUEST INTERCEPTOR
 *
 * Security: Adds authentication token to every request.
 * Only sends token if it exists.
 */
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from secure storage
    const token = localStorage.getItem(AUTH_TOKEN_KEY);

    // Add token to Authorization header if exists
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for debugging (dev only)
    if (import.meta.env.DEV) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    console.error("[API] Request setup error:", error.message);
    return Promise.reject(error);
  },
);

/**
 * RESPONSE INTERCEPTOR
 *
 * Security: Handles errors globally and prevents sensitive data leaks.
 * Automatically redirects to login on 401.
 */
axiosClient.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log(`[API] ${response.config.url} -> ${response.status}`);
    }
    return response;
  },
  (error: AxiosError) => {
    // Secure error handling - don't expose internal details in production

    if (error.response) {
      const status = error.response.status;
      const url = error.config?.url || "unknown";

      // Log error without exposing sensitive data
      if (import.meta.env.DEV) {
        console.error(`[API Error] ${url} -> ${status}`);
      }

      switch (status) {
        case 401:
          // Unauthorized - Clear auth and redirect to login
          console.warn("[API] Unauthorized - Clearing auth state");
          localStorage.removeItem(AUTH_TOKEN_KEY);

          // Redirect to login if in browser
          if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
            // Only redirect if not already on login page
            window.location.href = "/login";
          }
          break;

        case 403:
          // Forbidden - User doesn't have permission
          console.warn("[API] Forbidden access");
          break;

        case 404:
          // Not Found - Resource doesn't exist
          if (import.meta.env.DEV) {
            console.warn(`[API] Resource not found: ${url}`);
          }
          break;

        case 422:
          // Validation Error - Show form validation
          if (import.meta.env.DEV) {
            console.warn(`[API] Validation error:`, error.response.data);
          }
          break;

        case 429:
          // Rate Limited
          console.warn("[API] Rate limited - Too many requests");
          break;

        case 500:
        case 502:
        case 503:
        case 504:
          // Server Errors - Generic message for security
          console.error("[API] Server error occurred");
          break;

        default:
          // Other errors
          if (import.meta.env.DEV) {
            console.error(`[API] Error ${status}:`, error.response.data);
          }
      }
    } else if (error.request) {
      // Network error - No response received
      console.error("[API] Network error - No response from server");
    } else {
      // Request setup error
      console.error("[API] Request error:", error.message);
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
