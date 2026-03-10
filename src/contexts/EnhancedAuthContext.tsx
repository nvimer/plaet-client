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
import { logger } from "@/utils";
import {
  useAuthActions,
} from "@/utils/useAuthActions";
import {
  getUserFromStorage,
  removeUserFromStorage,
  createTimeoutPromise,
  saveUserToStorage,
  AUTH_CHECK_TIMEOUT,
  type AuthError,
  type AuthState,
} from "@/utils/authHelpers";

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
 * Auth Context
 */
const AuthContext = createContext<AuthContextType | null>(null);

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

  const initializationLockRef = useRef<boolean>(false);

  const updateState = useCallback((updates: Partial<AuthState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const setLoading = useCallback(
    (isLoading: boolean) => {
      updateState({ isLoading });
    },
    [updateState],
  );

  const setError = useCallback(
    (error: AuthError | null) => {
      updateState({ error, lastActivity: new Date() });
    },
    [updateState],
  );

  const clearError = useCallback(() => {
    updateState({ error: null });
  }, [updateState]);

  const updateUser = useCallback(
    (userData: Partial<User>) => {
      const updatedUser = { ...state.user, ...userData } as User;
      updateState({ user: updatedUser });
      saveUserToStorage(updatedUser);
    },
    [state.user, updateState],
  );

  const {
    login,
    register,
    logout,
    refreshToken,
    checkAuth,
    retryAuth: retryAuthAction,
  } = useAuthActions({
    state,
    updateState,
    setLoading,
    setError,
  });

  const retryAuth = useCallback(async (): Promise<void> => {
    clearError();
    await retryAuthAction();
  }, [clearError, retryAuthAction]);

  useEffect(() => {
    const initializeAuth = async () => {
      if (initializationLockRef.current) return;
      initializationLockRef.current = true;

      const storedUser = getUserFromStorage();

      if (storedUser) {
        try {
          const result = await Promise.race([
            checkAuth(),
            createTimeoutPromise(AUTH_CHECK_TIMEOUT),
          ]);

          if (!result) {
            updateState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
              lastActivity: new Date(),
            });
          }
        } catch {
          logger.error("Failed to initialize auth");
          updateState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            lastActivity: new Date(),
          });
          removeUserFromStorage();
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
  }, [checkAuth, updateState]);

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

export default AuthContext;
export { AuthContext };
