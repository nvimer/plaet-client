/**
 * ENHANCED AUTH CONTEXT
 *
 * Enhanced authentication context with token refresh,
 * error handling, proper state management, and timeout protection.
 */

import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import type { ReactNode } from "react";
import type { User, LoginInput, RegisterInput } from "@/types";
import { authApi, profileApi } from "@/services";

/**
 * Authentication error types
 */
export interface AuthError {
  type?: "AUTH" | "NETWORK" | "TIMEOUT" | null;
  message: string;
  code?: string;
  field?: string;
}

/**
 * Authentication state
 */
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
  lastActivity: Date | null;
}

/**
 * Authentication context interface
 */
interface AuthContextType extends AuthState {
  login: (credentials: LoginInput) => Promise<void>;
  register: (userData: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  clearError: () => void;
  updateUser: (userData: Partial<User>) => void;
  retryAuth: () => Promise<void>;
}

/**
 * Constants
 */
const TOKEN_REFRESH_INTERVAL = 14 * 60 * 1000;
const AUTH_CHECK_TIMEOUT = 10000;

/**
 * Get user from localStorage safely
 */
const getUserFromStorage = (): User | null => {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

/**
 * Save user to localStorage safely
 */
const saveUserToStorage = (user: User): void => {
  try {
    localStorage.setItem("user", JSON.stringify(user));
  } catch {
    console.error("Failed to save user to localStorage");
  }
};

/**
 * Remove user from localStorage
 */
const removeUserFromStorage = (): void => {
  localStorage.removeItem("user");
};

/**
 * Create timeout promise
 */
const createTimeoutPromise = (ms: number): Promise<never> =>
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout")), ms),
  );

/**
 * Enhanced AuthProvider
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    lastActivity: null,
  });

  const refreshIntervalRef = useRef<number | null>(null);

  /**
   * Update state helper
   */
  const updateState = useCallback((updates: Partial<AuthState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  /**
   * Set loading state
   */
  const setLoading = useCallback(
    (isLoading: boolean) => {
      updateState({ isLoading });
    },
    [updateState],
  );

  /**
   * Set error state
   */
  const setError = useCallback(
    (error: AuthError | null) => {
      updateState({ error, lastActivity: new Date() });
    },
    [updateState],
  );

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    updateState({ error: null });
  }, [updateState]);

  /**
   * Update user data
   */
  const updateUser = useCallback((userData: Partial<User>) => {
    setState((prev) => {
      if (!prev.user) return prev;

      const updatedUser = { ...prev.user, ...userData };
      saveUserToStorage(updatedUser);

      return {
        ...prev,
        user: updatedUser,
        lastActivity: new Date(),
      };
    });
  }, []);

  /**
   * Fetch user with roles and permissions
   */
  const fetchUserWithRoles = useCallback(async (): Promise<User | null> => {
    try {
      const profileResponse = await profileApi.getMyProfile();
      const userData = profileResponse.data;

      if (!userData.id) {
        return userData;
      }

      // Token validation - if profile data doesn't match token, it's invalid
      const currentToken =
        localStorage.getItem("accessToken") ||
        (document.cookie.match(/(^|;)\s*accessToken=([^;]*)/) || [])[1];

      if (!currentToken || currentToken.length < 10) {
        throw new Error("TOKEN_INVALID");
      }

      console.log("[FETCH_USER] Token appears valid, fetching user profile");

      try {
        const { usersApi } = await import("@/services");
        const rolesResponse = await usersApi.getUserWithRolesAndPermissions(
          userData.id,
        );

        const userWithRoles = {
          ...userData,
          roles: rolesResponse.data.roles.map((r) => r.role),
        };

        saveUserToStorage(userWithRoles);
        console.log("[FETCH_USER] User roles fetched successfully");
        return userWithRoles;
      } catch (rolesError) {
        console.warn("[FETCH_USER] Could not fetch user roles");
        const axiosError = rolesError as { response?: { status?: number } };
        if (
          axiosError.response?.status === 401 ||
          axiosError.response?.status === 403
        ) {
          throw rolesError;
        }
        saveUserToStorage(userData);
        return userData;
      }
    } catch (error) {
      console.error("[FETCH_USER] Failed to fetch user profile");

      const axiosError = error as {
        response?: { status?: number; data?: { errorCode?: string } };
        code?: string;
      };

      console.log(`[FETCH_USER] Error details:`, {
        status: axiosError.response?.status,
        errorCode: axiosError.response?.data?.errorCode,
        code: axiosError.code,
      });

      if (
        axiosError.response?.status === 401 ||
        axiosError.code === "AUTH_REFRESH_FAILED"
      ) {
        console.error(`[FETCH_USER] Auth error detected - propagating`);
        throw error;
      }

      console.log(`[FETCH_USER] Returning null for non-auth error`);
      return null;
    }
  }, []);

  /**
   * Setup automatic token refresh
   */
  const setupTokenRefresh = useCallback(() => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }

    const interval = window.setInterval(async () => {
      try {
        await authApi.refreshToken();
        console.info("Token refreshed successfully");
      } catch {
        console.error("Failed to refresh token");
        updateState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: {
            type: "AUTH",
            message:
              "Tu sesión ha terminado. Por favor inicia sesión nuevamente.",
            code: "TOKEN_REFRESH_FAILED",
          },
        });
        removeUserFromStorage();
      }
    }, TOKEN_REFRESH_INTERVAL);

    refreshIntervalRef.current = interval;
  }, [updateState]);

  /**
   * Login function
   */
  const login = useCallback(
    async (credentials: LoginInput): Promise<void> => {
      setLoading(true);
      clearError();

      try {
        await authApi.login(credentials);

        const userWithRoles = await fetchUserWithRoles();

        if (userWithRoles) {
          updateState({
            user: userWithRoles,
            isAuthenticated: true,
            error: null,
            lastActivity: new Date(),
          });
          setupTokenRefresh();
        } else {
          throw new Error("Failed to fetch user profile");
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error && "response" in error
            ? (
                error as {
                  response?: {
                    data?: {
                      message?: string;
                      error?: string;
                      errorCode?: string;
                    };
                  };
                }
              ).response?.data?.message ||
              (error as { response?: { data?: { error?: string } } }).response
                ?.data?.error ||
              error.message
            : "Error al iniciar sesión. Verifica tus credenciales.";

        const errorCode =
          error instanceof Error && "response" in error
            ? (error as { response?: { data?: { errorCode?: string } } })
                .response?.data?.errorCode || "LOGIN_FAILED"
            : "LOGIN_FAILED";

        setError({
          message: errorMessage,
          code: errorCode,
        });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [fetchUserWithRoles, setupTokenRefresh, setLoading, clearError, setError],
  );

  /**
   * Register function
   */
  const register = useCallback(
    async (userData: RegisterInput): Promise<void> => {
      setLoading(true);
      clearError();

      try {
        await authApi.register(userData);

        setError({
          message:
            "Registro exitoso. Por favor verifica tu correo electrónico.",
          code: "EMAIL_VERIFICATION_REQUIRED",
        });
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error && "response" in error
            ? (error as { response?: { data?: { message?: string } } }).response
                ?.data?.message || error.message
            : "Error al registrar usuario. Inténtalo nuevamente.";

        const errorCode =
          error instanceof Error && "response" in error
            ? (error as { response?: { data?: { errorCode?: string } } })
                .response?.data?.errorCode || "REGISTER_FAILED"
            : "REGISTER_FAILED";

        setError({
          message: errorMessage,
          code: errorCode,
        });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, setError],
  );

  /**
   * Logout function
   */
  const logout = useCallback(async (): Promise<void> => {
    setLoading(true);

    try {
      await authApi.logout();
    } catch {
      console.error("Error calling logout API");
    } finally {
      updateState({
        user: null,
        isAuthenticated: false,
        error: null,
        lastActivity: new Date(),
      });

      removeUserFromStorage();

      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }

      setLoading(false);
      console.info("User logged out successfully");
    }
  }, [updateState, setLoading]);

  /**
   * Refresh token function
   */
  const refreshToken = useCallback(async (): Promise<void> => {
    try {
      await authApi.refreshToken();
      console.info("Token refreshed manually");
    } catch {
      console.error("Manual token refresh failed");
      setError({
        message:
          "Error al refrescar la sesión. Por favor inicia sesión nuevamente.",
        code: "TOKEN_REFRESH_FAILED",
      });
    }
  }, [setError]);

  /**
   * Check authentication status with timeout
   */
  const checkAuth = useCallback(async (): Promise<boolean> => {
    try {
      console.log("[CHECK] Starting auth check...");
      const result = await Promise.race([
        fetchUserWithRoles(),
        createTimeoutPromise(AUTH_CHECK_TIMEOUT),
      ]);

      console.log("[CHECK] fetchUserWithRoles result:", result);

      if (result) {
        console.log("[CHECK] Auth check successful");
        updateState({
          user: result,
          isAuthenticated: true,
          error: null,
          lastActivity: new Date(),
        });
        setupTokenRefresh();
        return true;
      }

      console.log("[CHECK] fetchUserWithRoles returned null");

      updateState({
        user: null,
        isAuthenticated: false,
        error: null,
        lastActivity: new Date(),
      });
      return false;
    } catch (error) {
      console.error("[CHECK] Auth check failed with error:", error);

      const axiosError = error as {
        response?: { status?: number; data?: { errorCode?: string } };
        code?: string;
      };

      console.log("[CHECK] Caught error details:", {
        status: axiosError.response?.status,
        errorCode: axiosError.response?.data?.errorCode,
        code: axiosError.code,
      });

      let errorType: "AUTH" | "NETWORK";

      if (
        axiosError.response?.status === 401 ||
        axiosError.code === "AUTH_REFRESH_FAILED"
      ) {
        errorType = "AUTH";
        console.log("[CHECK] Classified as AUTH error");
      } else {
        errorType = "NETWORK";
        console.log("[CHECK] Classified as NETWORK error");
      }

      updateState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: {
          type: errorType,
          message:
            errorType === "AUTH"
              ? "Tu sesión ha terminado. Por favor inicia sesión nuevamente."
              : "No se pudo conectar con el servidor. Verifica tu conexión.",
          code: "AUTH_CHECK_FAILED",
        },
        lastActivity: new Date(),
      });
      removeUserFromStorage();
      return false;
    }
  }, [fetchUserWithRoles, setupTokenRefresh, updateState]);

  /**
   * Retry authentication manually
   */
  const retryAuth = useCallback(async (): Promise<void> => {
    clearError();
    setLoading(true);

    const storedUser = getUserFromStorage();
    if (storedUser) {
      const success = await checkAuth();
      if (!success) {
        const userStill = getUserFromStorage();
        if (userStill) {
          return;
        }
      }
    } else {
      updateState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        lastActivity: new Date(),
      });
    }
  }, [clearError, setLoading, checkAuth, updateState]);

  /**
   * Initialize authentication on mount
   */
  useEffect(() => {
    const initializeAuth = async () => {
      console.log("[INIT] Starting auth initialization...");
      const storedUser = getUserFromStorage();
      console.log("[INIT] Has stored user:", !!storedUser);

      if (storedUser) {
        try {
          console.log("[INIT] Calling checkAuth...");
          const result = await Promise.race([
            checkAuth(),
            createTimeoutPromise(AUTH_CHECK_TIMEOUT),
          ]);
          console.log("[INIT] checkAuth result:", result);

          if (!result) {
            console.log("[INIT] checkAuth returned false");
          }
        } catch (initError) {
          console.error("[INIT] Error during initialization:", initError);
        }
      } else {
        console.log("[INIT] No stored user, setting not authenticated");
        updateState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
          lastActivity: new Date(),
        });
      }
    };

    initializeAuth();

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [checkAuth, updateState]);

  /**
   * Context value memoized
   */
  const value = useMemo<AuthContextType>(
    () => ({
      ...state,
      login,
      register,
      logout,
      refreshToken,
      checkAuth,
      clearError,
      updateUser,
      retryAuth,
    }),
    [
      state,
      login,
      register,
      logout,
      refreshToken,
      checkAuth,
      clearError,
      updateUser,
      retryAuth,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Export the context
 */
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
