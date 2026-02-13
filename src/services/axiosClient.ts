/**
 * AXIOS CLIENT CONFIGURATION
 *
 * Production-ready Axios instance with security best practices:
 * - Automatic token authentication via httpOnly cookies
 * - Secure error handling
 * - Retry logic for network errors
 * - Queue management during token refresh
 */

import type { InternalAxiosRequestConfig } from "axios";
import axios, { AxiosError } from "axios";
import { API_URL, API_TIMEOUT } from "../config/constants";

export const axiosClient = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

const RETRY_DELAY = 1000;
const MAX_RETRIES = 3;

let isRefreshing = false;

/**
 * REQUEST INTERCEPTOR
 */
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
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
 */
axiosClient.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`[API] ${response.config.url} -> ${response.status}`);
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const url = originalRequest.url || "unknown";

    if (import.meta.env.DEV) {
      console.error(
        `[API Error] ${url} ->`,
        error.response?.status || "Network Error",
      );
    }

    if (error.response) {
      const status = error.response.status;

      switch (status) {
        case 401: {
          console.log(`[AXIOS INTERCEPTOR] 401 received for ${url}`);
          console.log(`[AXIOS INTERCEPTOR] Error data:`, error.response?.data);

          const isRefreshEndpoint = originalRequest.url?.includes(
            "/auth/refresh-token",
          );

          if (isRefreshEndpoint) {
            console.warn(
              "[AXIOS INTERCEPTOR] Refresh token itself is invalid - closing session",
            );
            const authError = new Error("REFRESH_TOKEN_INVALID");
            (authError as { code?: string }).code = "AUTH_REFRESH_FAILED";
            throw authError;
          }

          console.warn(
            "[AXIOS INTERCEPTOR] Unauthorized - Token may be expired",
          );

          if (!isRefreshing) {
            isRefreshing = true;

            try {
              console.log("[AXIOS INTERCEPTOR] Attempting token refresh...");
              await axios.post(`${API_URL}/auth/refresh-token`, undefined, {
                withCredentials: true,
              });

              console.log("[AXIOS INTERCEPTOR] Token refreshed successfully");
              isRefreshing = false;
              return axiosClient(originalRequest);
            } catch (refreshError) {
              console.error(
                "[AXIOS INTERCEPTOR] Token refresh failed:",
                refreshError,
              );
              isRefreshing = false;
              const authError = new Error("TOKEN_REFRESH_FAILED");
              (authError as { code?: string }).code = "AUTH_REFRESH_FAILED";
              console.log("[AXIOS INTERCEPTOR] Throwing AUTH_REFRESH_FAILED");
              throw authError;
            }
          }

          return new Promise((resolve, reject) => {
            const authError = new Error("AUTH_REFRESH_IN_PROGRESS");
            (authError as { code?: string }).code = "AUTH_REFRESH_FAILED";
            reject(authError);
          });
        }

        case 403: {
          console.warn("[API] Forbidden - Insufficient permissions");
          break;
        }

        case 404: {
          if (import.meta.env.DEV) {
            console.warn(`[API] Resource not found: ${url}`);
          }
          break;
        }

        case 422: {
          if (import.meta.env.DEV) {
            console.warn("[API] Validation error:", error.response.data);
          }
          break;
        }

        case 423: {
          const responseData = error.response?.data as {
            message?: string;
            lockedUntil?: string;
          };
          const message = responseData?.message || "Tu cuenta está bloqueada.";
          const lockedUntil = responseData?.lockedUntil;

          console.warn(`[API] Account locked: ${message}`);

          if (
            typeof window !== "undefined" &&
            !window.location.pathname.includes("/lockout")
          ) {
            const params = new URLSearchParams();
            if (lockedUntil) {
              params.set(
                "expiresAt",
                new Date(lockedUntil).getTime().toString(),
              );
            }
            window.location.href = `/lockout?${params.toString()}`;
          }

          return Promise.reject(error);
        }

        case 429: {
          const retryAfter = error.response.headers["retry-after"];
          const seconds = retryAfter ? parseInt(retryAfter, 10) : 60;
          console.warn(`[API] Rate limited. Retry after ${seconds} seconds`);
          break;
        }

        case 500:
        case 502:
        case 503:
        case 504: {
          console.error("[API] Server error occurred");
          break;
        }

        default: {
          if (import.meta.env.DEV) {
            console.error(`[API] Error ${status}:`, error.response.data);
          }
        }
      }
    } else if (error.request) {
      console.error("[API] Network error - No response from server");

      if ((error.request as { retried?: boolean }).retried) {
        return Promise.reject(error);
      }

      const retryCount =
        (originalRequest as { _retryCount?: number })._retryCount || 0;

      if (retryCount < MAX_RETRIES) {
        (originalRequest as { _retryCount?: number })._retryCount =
          retryCount + 1;

        console.log(
          `[API] Retrying request (${retryCount + 1}/${MAX_RETRIES})...`,
        );

        await new Promise((resolve) =>
          setTimeout(resolve, RETRY_DELAY * (retryCount + 1)),
        );

        return axiosClient(originalRequest);
      }
    } else {
      console.error("[API] Request error:", error.message);
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
