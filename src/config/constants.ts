/**
 * APPLICATION CONSTANTS
 *
 * Centralized constants for:
 * 1. Avoiding magic numbers
 * 2. Easy configuration changes
 * 3. Better maintainability
 */

// Base API URL from environment variables
// VITE_API_URL comes from .env file
// Fallback to localhost for development
const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    return envUrl;
  }
  // Default to localhost for development
  return "http://localhost:8080";
};

// Check if we're in production
export const isProduction = import.meta.env.PROD;

// API Configuration
export const API_BASE_URL = getApiBaseUrl();
export const API_PREFIX = "/api/v1";
export const API_URL = `${API_BASE_URL}${API_PREFIX}`;

// Application Name
export const APP_NAME = "Plaet";

// Pagination
export const ITEMS_PER_PAGE = 20;

// Request timeout (milliseconds)
export const API_TIMEOUT = 15000; // 15 seconds for production reliability

// React Query cache times
export const CACHE_TIME = 5 * 60 * 1000; // 5 minutes
export const STALE_TIME = 1 * 60 * 1000; // 1 minute

// Auth Keys
export const AUTH_TOKEN_KEY = "authToken";
export const USER_DATA_KEY = "userData";
