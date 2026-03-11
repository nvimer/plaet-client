import { create } from "zustand";
import { useEffect, useRef } from "react";
import type { User, LoginInput, RegisterInput } from "@/types";
import { authApi, profileApi, usersApi } from "@/services";
import { logger } from "@/utils";
import {
  TOKEN_REFRESH_INTERVAL,
  AUTH_CHECK_TIMEOUT,
  getUserFromStorage,
  saveUserToStorage,
  removeUserFromStorage,
  parseAuthError,
  getAuthErrorType,
  createTimeoutPromise,
  type AuthState,
  type AuthError,
} from "@/utils/authHelpers";

/**
 * Auth Actions Interface
 */
interface AuthActions {
  login: (credentials: LoginInput) => Promise<void>;
  register: (userData: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  clearError: () => void;
  updateUser: (userData: Partial<User>) => void;
  retryAuth: () => Promise<void>;
  setLoading: (isLoading: boolean) => void;
  setError: (error: AuthError | null) => void;
}

/**
 * Combined Auth Store Interface
 */
interface AuthStore extends AuthState, AuthActions {}

let refreshInterval: number | null = null;

const clearTokenRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
};

/**
 * useAuthStore
 * 
 * Centralized store for authentication and session management.
 * Replaces EnhancedAuthContext and provides better performance and debuggability.
 */
export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial State
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  lastActivity: null,

  // Simple Actions
  setLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: AuthError | null) => set({ error, lastActivity: new Date() }),
  clearError: () => set({ error: null }),

  updateUser: (userData: Partial<User>) => {
    const { user } = get();
    if (!user) return;
    
    const updatedUser = { ...user, ...userData } as User;
    set({ user: updatedUser });
    saveUserToStorage(updatedUser);
  },

  // Complex Business Logic
  setupTokenRefresh: () => {
    clearTokenRefresh();

    refreshInterval = window.setInterval(async () => {
      try {
        await authApi.refreshToken();
      } catch {
        set({
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
        clearTokenRefresh();
      }
    }, TOKEN_REFRESH_INTERVAL);
  },

  fetchUserWithRoles: async (): Promise<User | null> => {
    try {
      const profileResponse = await profileApi.getMyProfile();
      const userData = profileResponse.data;

      if (!userData.id) {
        return userData;
      }

      try {
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
  },

  login: async (credentials: LoginInput): Promise<void> => {
    set({ isLoading: true, error: null });

    try {
      await authApi.login(credentials);
      const userWithRoles = await get().fetchUserWithRoles();

      if (userWithRoles) {
        set({
          user: userWithRoles,
          isAuthenticated: true,
          isLoading: false,
          error: null,
          lastActivity: new Date(),
        });
        // @ts-expect-error - access internal function
        get().setupTokenRefresh();
      } else {
        throw new Error("Failed to fetch user profile after login");
      }
    } catch (error: unknown) {
      const errorMessage = parseAuthError(error);
      set({ error: { message: errorMessage }, isLoading: false });
      throw error;
    }
  },

  register: async (userData: RegisterInput): Promise<void> => {
    set({ isLoading: true, error: null });

    try {
      await authApi.register(userData);
      set({
        error: {
          message: "Registro exitoso. Por favor verifica tu correo electrónico.",
        },
        isLoading: false
      });
    } catch (error: unknown) {
      const errorMessage = parseAuthError(error);
      set({ error: { message: errorMessage }, isLoading: false });
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    set({ isLoading: true });

    try {
      await authApi.logout();
    } catch {
      logger.error("Error calling logout API");
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        lastActivity: new Date(),
      });

      removeUserFromStorage();
      clearTokenRefresh();
    }
  },

  refreshToken: async (): Promise<void> => {
    await authApi.refreshToken();
  },

  checkAuth: async (): Promise<boolean> => {
    try {
      const result = await Promise.race([
        get().fetchUserWithRoles(),
        createTimeoutPromise(AUTH_CHECK_TIMEOUT),
      ]);

      if (result) {
        set({
          user: result,
          isAuthenticated: true,
          isLoading: false,
          error: null,
          lastActivity: new Date(),
        });
        // @ts-expect-error - access internal function
        get().setupTokenRefresh();
        return true;
      }

      set({
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

      set({
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
      clearTokenRefresh();
      return false;
    }
  },

  retryAuth: async (): Promise<void> => {
    set({ error: null, isLoading: true });

    const storedUser = getUserFromStorage();
    if (storedUser) {
      try {
        await get().checkAuth();
      } catch {
        // Error already handled in checkAuth
      }
    } else {
      set({
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
  },
}));

/**
 * Initialize Auth Hook
 * 
 * Should be called once at the app root level to initialize session.
 */
export const useInitializeAuth = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const setLoading = useAuthStore((state) => state.setLoading);
  
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const init = async () => {
      const storedUser = getUserFromStorage();
      if (storedUser) {
        await checkAuth();
      } else {
        setLoading(false);
      }
    };

    init();
  }, [checkAuth, setLoading]);
};
