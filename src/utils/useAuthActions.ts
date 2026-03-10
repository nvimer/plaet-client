import { useCallback, useRef } from "react";
import type { User, LoginInput, RegisterInput } from "@/types";
import { authApi, profileApi } from "@/services";
import { logger } from "@/utils";
import {
  TOKEN_REFRESH_INTERVAL,
  getUserFromStorage,
  saveUserToStorage,
  removeUserFromStorage,
  parseAuthError,
  getAuthErrorType,
  type AuthState,
  type AuthError,
} from "@/utils/authHelpers";

interface UseAuthActionsProps {
  state: AuthState;
  updateState: (updates: Partial<AuthState>) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: AuthError | null) => void;
}

interface UseAuthActionsReturn {
  fetchUserWithRoles: () => Promise<User | null>;
  setupTokenRefresh: () => void;
  clearTokenRefresh: () => void;
  login: (credentials: LoginInput) => Promise<void>;
  register: (userData: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  retryAuth: () => Promise<void>;
}

export function useAuthActions({
  state: _state,
  updateState,
  setLoading,
  setError,
}: UseAuthActionsProps): UseAuthActionsReturn {
  const refreshIntervalRef = useRef<number | null>(null);

  const fetchUserWithRoles = useCallback(async (): Promise<User | null> => {
    try {
      const profileResponse = await profileApi.getMyProfile();
      const userData = profileResponse.data;

      if (!userData.id) {
        return userData;
      }

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
      } catch {
        saveUserToStorage(userData);
        return userData;
      }
    } catch (error) {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 401) {
        throw error;
      }
      return null;
    }
  }, []);

  const clearTokenRefresh = useCallback(() => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
  }, []);

  const setupTokenRefresh = useCallback(() => {
    clearTokenRefresh();

    const interval = window.setInterval(async () => {
      try {
        await authApi.refreshToken();
      } catch {
        updateState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: {
            type: "AUTH",
            message: "Tu sesión ha terminado. Por favor inicia sesión nuevamente.",
            code: "TOKEN_REFRESH_FAILED",
          },
        });
        removeUserFromStorage();
      }
    }, TOKEN_REFRESH_INTERVAL);

    refreshIntervalRef.current = interval;
  }, [clearTokenRefresh, updateState]);

  const login = useCallback(
    async (credentials: LoginInput): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        await authApi.login(credentials);
        const userWithRoles = await fetchUserWithRoles();

        if (userWithRoles) {
          updateState({
            user: userWithRoles,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            lastActivity: new Date(),
          });
          setupTokenRefresh();
        } else {
          throw new Error("Failed to fetch user profile after login");
        }
      } catch (error: unknown) {
        const errorMessage = parseAuthError(error);
        setError({ message: errorMessage });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [fetchUserWithRoles, setupTokenRefresh, setLoading, setError, updateState],
  );

  const register = useCallback(
    async (userData: RegisterInput): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        await authApi.register(userData);
        setError({
          message: "Registro exitoso. Por favor verifica tu correo electrónico.",
        });
      } catch (error: unknown) {
        const errorMessage = parseAuthError(error);
        setError({ message: errorMessage });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError],
  );

  const logout = useCallback(async (): Promise<void> => {
    setLoading(true);

    try {
      await authApi.logout();
    } catch {
      logger.error("Error calling logout API");
    } finally {
      updateState({
        user: null,
        isAuthenticated: false,
        error: null,
        lastActivity: new Date(),
      });

      removeUserFromStorage();
      clearTokenRefresh();
      setLoading(false);
    }
  }, [updateState, setLoading, clearTokenRefresh]);

  const refreshToken = useCallback(async (): Promise<void> => {
    await authApi.refreshToken();
  }, []);

  const checkAuth = useCallback(async (): Promise<boolean> => {
    const { AUTH_CHECK_TIMEOUT, createTimeoutPromise } = await import("@/utils/authHelpers");
    
    try {
      const result = await Promise.race([
        fetchUserWithRoles(),
        createTimeoutPromise(AUTH_CHECK_TIMEOUT),
      ]);

      if (result) {
        updateState({
          user: result,
          isAuthenticated: true,
          isLoading: false,
          error: null,
          lastActivity: new Date(),
        });
        setupTokenRefresh();
        return true;
      }

      updateState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        lastActivity: new Date(),
      });
      return false;
    } catch (error) {
      const storedUser = getUserFromStorage();
      const errorType = getAuthErrorType(error, storedUser);

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

  const retryAuth = useCallback(async (): Promise<void> => {
    setError(null);
    setLoading(true);

    const storedUser = getUserFromStorage();
    if (storedUser) {
      try {
        await checkAuth();
      } catch {
        // Error already handled in checkAuth
      }
    } else {
      updateState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: {
          type: "AUTH",
          message: "No hay sesión activa. Por favor inicia sesión.",
          code: "NO_SESSION",
        },
        lastActivity: new Date(),
      });
    }
  }, [checkAuth, setError, setLoading, updateState]);

  return {
    fetchUserWithRoles,
    setupTokenRefresh,
    clearTokenRefresh,
    login,
    register,
    logout,
    refreshToken,
    checkAuth,
    retryAuth,
  };
}
