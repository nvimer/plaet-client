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
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
  config: InternalAxiosRequestConfig;
}> = [];

const processQueue = (error: Error | null): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(axiosClient(prom.config));
    }
  });
  failedQueue = [];
};

/**
 * REQUEST INTERCEPTOR
 */
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * RESPONSE INTERCEPTOR
 */
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const url = originalRequest.url || "unknown";

    if (error.response) {
      const status = error.response.status;

      switch (status) {
        case 401: {
          const isRefreshEndpoint = originalRequest.url?.includes(
            "/auth/refresh-token",
          );

          if (isRefreshEndpoint) {
            console.warn(
              "[Auth] Refresh token invalid - session closed",
            );
            processQueue(new Error("REFRESH_TOKEN_INVALID"));
            const authError = new Error("REFRESH_TOKEN_INVALID");
            (authError as { code?: string }).code = "AUTH_REFRESH_FAILED";
            throw authError;
          }

          if (!isRefreshing) {
            isRefreshing = true;

            try {
              await axios.post(`${API_URL}/auth/refresh-token`, undefined, {
                withCredentials: true,
              });

              isRefreshing = false;
              processQueue(null);
              return axiosClient(originalRequest);
            } catch (refreshError) {
              isRefreshing = false;
              const authError = new Error("TOKEN_REFRESH_FAILED");
              (authError as { code?: string }).code = "AUTH_REFRESH_FAILED";
              processQueue(authError);
              throw authError;
            }
          }

          return new Promise((resolve, reject) => {
            failedQueue.push({
              resolve,
              reject,
              config: originalRequest,
            });
          });
        }

        case 403: {
          if (import.meta.env.DEV) {
            console.warn(`[API] Forbidden (403): ${url}`);
          }
          break;
        }

        case 404: {
          if (import.meta.env.DEV) {
            console.warn(`[API] Not Found (404): ${url}`);
          }
          break;
        }

        case 422: {
          if (import.meta.env.DEV) {
            console.warn(`[API] Validation Error (422): ${url}`, error.response.data);
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
          console.warn(`[API] Rate limited (429): ${url}`);
          break;
        }

        case 500:
        case 502:
        case 503:
        case 504: {
          console.error(`[API] Server error (${status}): ${url}`);
          break;
        }
      }
    } else if (error.request) {
      if ((error.request as { retried?: boolean }).retried) {
        return Promise.reject(error);
      }

      const retryCount =
        (originalRequest as { _retryCount?: number })._retryCount || 0;

      if (retryCount < MAX_RETRIES) {
        (originalRequest as { _retryCount?: number })._retryCount =
          retryCount + 1;

        await new Promise((resolve) =>
          setTimeout(resolve, RETRY_DELAY * (retryCount + 1)),
        );

        return axiosClient(originalRequest);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
