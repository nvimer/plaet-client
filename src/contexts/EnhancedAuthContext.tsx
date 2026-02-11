/**
 * ENHANCED AUTH CONTEXT
 *
 * Enhanced authentication context with token refresh,
 * error handling, and proper state management.
 */

import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import type { ReactNode } from "react";
import type { User, LoginInput, RegisterInput } from "@/types";
import { authApi, profileApi } from "@/services";

/**
 * Authentication error types
 */
export interface AuthError {
  code?: string;
  message: string;
  field?: string;
}

/**
 * Enhanced authentication state
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
  // Authentication actions
  login: (credentials: LoginInput) => Promise<void>;
  register: (userData: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;

  // Token management
  refreshToken: () => Promise<void>;
  checkAuth: () => Promise<boolean>;

  // Error handling
  clearError: () => void;

  // User state
  updateUser: (userData: Partial<User>) => void;
}

/**
 * Token management utilities
 */
const TOKEN_REFRESH_INTERVAL = 14 * 60 * 1000; // 14 minutes

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
 * Enhanced AuthProvider
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  // Authentication state
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
    lastActivity: null,
  });

  // Token refresh interval
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);

  /**
   * Update state helper
   */
  const updateState = useCallback((updates: Partial<AuthState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  /**
   * Set loading state
   */
  const setLoading = useCallback((isLoading: boolean) => {
    updateState({ isLoading });
  }, []);

  /**
   * Set error state
   */
  const setError = useCallback((error: AuthError | null) => {
    updateState({ error, lastActivity: new Date() });
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    updateState({ error: null });
  }, []);

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

      // Try to get roles and permissions
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
        return userWithRoles;
      } catch (error) {
        console.warn("Could not fetch user roles:", error);
        saveUserToStorage(userData);
        return userData;
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      return null;
    }
  }, []);

  /**
   * Setup automatic token refresh
   */
  const setupTokenRefresh = useCallback(() => {
    // Clear existing interval
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }

    // Setup new interval
    const interval = window.setInterval(async () => {
      try {
        await authApi.refreshToken();
        console.log("Token refreshed successfully");
      } catch (error) {
        console.error("Failed to refresh token:", error);
        // If refresh fails, user may need to login again
        setError({
          message: "Sesión expirada. Por favor inicia sesión nuevamente.",
          code: "TOKEN_REFRESH_FAILED",
        });
      }
    }, TOKEN_REFRESH_INTERVAL);

    setRefreshInterval(interval as number | null);
  }, [refreshInterval, setError]);

  /**
   * Login function
   */
  const login = useCallback(
    async (credentials: LoginInput): Promise<void> => {
      setLoading(true);
      clearError();

      try {
        // Call login API
        await authApi.login(credentials);

        // Tokens are handled via httpOnly cookies
        const userWithRoles = await fetchUserWithRoles();

        if (userWithRoles) {
          updateState({
            user: userWithRoles,
            isAuthenticated: true,
            error: null,
            lastActivity: new Date(),
          });

          // Setup token refresh
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

        setError({
          message: errorMessage,
          code:
            error instanceof Error && "response" in error
              ? (error as { response?: { data?: { errorCode?: string } } })
                  .response?.data?.errorCode || "LOGIN_FAILED"
              : "LOGIN_FAILED",
        });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [fetchUserWithRoles, setupTokenRefresh],
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

        // Registration successful but needs email verification
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

        setError({
          message: errorMessage,
          code:
            error instanceof Error && "response" in error
              ? (error as { response?: { data?: { errorCode?: string } } })
                  .response?.data?.errorCode || "REGISTER_FAILED"
              : "REGISTER_FAILED",
        });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  /**
   * Logout function
   */
  const logout = useCallback(async (): Promise<void> => {
    setLoading(true);

    try {
      // Call logout API
      await authApi.logout();
    } catch (error) {
      console.error("Error calling logout API:", error);
    } finally {
      // Clear local state and storage
      updateState({
        user: null,
        isAuthenticated: false,
        error: null,
        lastActivity: new Date(),
      });

      removeUserFromStorage();

      // Clear token refresh interval
      if (refreshInterval) {
        clearInterval(refreshInterval);
        setRefreshInterval(null);
      }

      setLoading(false);
      console.log("User logged out successfully");
    }
  }, [refreshInterval]);

  /**
   * Refresh token function
   */
  const refreshToken = useCallback(async (): Promise<void> => {
    try {
      await authApi.refreshToken();
      console.log("Token refreshed manually");
    } catch (error) {
      console.error("Manual token refresh failed:", error);
      setError({
        message:
          "Error al refrescar la sesión. Por favor inicia sesión nuevamente.",
        code: "TOKEN_REFRESH_FAILED",
      });
    }
  }, [setError]);

  /**
   * Check authentication status
   */
  const checkAuth = useCallback(async (): Promise<boolean> => {
    try {
      const user = await fetchUserWithRoles();

      if (user) {
        updateState({
          user,
          isAuthenticated: true,
          error: null,
          lastActivity: new Date(),
        });
        setupTokenRefresh();
        return true;
      } else {
        updateState({
          user: null,
          isAuthenticated: false,
          error: null,
          lastActivity: new Date(),
        });
        return false;
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      updateState({
        user: null,
        isAuthenticated: false,
        error: {
          message: "Error al verificar sesión",
          code: "AUTH_CHECK_FAILED",
        },
        lastActivity: new Date(),
      });
      return false;
    }
  }, [fetchUserWithRoles, setupTokenRefresh]);

  /**
   * Initialize authentication on mount
   */
  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = getUserFromStorage();

      if (storedUser) {
        try {
          await checkAuth();
        } catch (error) {
          console.error("Failed to initialize auth:", error);
          updateState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            lastActivity: new Date(),
          });
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
    };

    initializeAuth();

    // Cleanup on unmount
    return () => {
      if (refreshInterval) {
        window.clearInterval(refreshInterval);
      }
    };
  }, []);

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
