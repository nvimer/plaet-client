/**
 * USE ENHANCED AUTH HOOK
 *
 * Custom hook to use the enhanced authentication context
 * Provides type-safe access to auth functionality
 */

import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { AuthContext as EnhancedAuthContext } from "@/contexts/EnhancedAuthContext";
import type { User } from "@/types";

interface UserRole {
  name: string;
  permissions?: Array<{ permission?: { name: string } }>;
}

interface AuthUser {
  roles?: UserRole[];
}

/**
 * Enhanced useAuth hook
 *
 * Provides access to authentication state and functions.
 * Automatically detects which context is available.
 */
export function useAuth() {
  const enhancedContext = useContext(EnhancedAuthContext);
  const originalContext = useContext(AuthContext);

  if (enhancedContext) {
    return enhancedContext;
  }

  if (originalContext) {
    return {
      ...originalContext,
      isLoading: false,
      error: null,
      lastActivity: null,
      logout: () => Promise.resolve(),
    };
  }

  throw new Error("useAuth must be used within an AuthProvider");
}

/**
 * Hook for authentication state only
 */
export function useAuthState() {
  const auth = useAuth();

  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    error: auth.isLoading ? false : null,
    lastActivity: null,
  };
}

/**
 * Hook for authentication actions only
 */
export function useAuthActions() {
  const auth = useAuth();

  return {
    login: auth.login,
    register:
      (auth as { register?: (data: unknown) => Promise<void> }).register ??
      (() => Promise.resolve()),
    logout: auth.logout as () => Promise<void>,
    refreshToken:
      (auth as { refreshToken?: () => Promise<void> }).refreshToken ??
      (() => Promise.resolve()),
    checkAuth:
      (auth as { checkAuth?: () => Promise<boolean> }).checkAuth ??
      (() => Promise.resolve(false)),
    clearError: (auth as { clearError?: () => void }).clearError ?? (() => {}),
    updateUser:
      (auth as { updateUser?: (data: Partial<User>) => void }).updateUser ??
      (() => {}),
  };
}

/**
 * Hook for user information only
 */
export function useUser() {
  const auth = useAuth();

  return {
    user: auth.user as AuthUser | null,
    updateUser:
      (auth as { updateUser?: (data: Partial<User>) => void }).updateUser ??
      (() => {}),
    hasRole: (roleName: string) => {
      const user = auth.user as AuthUser | null;
      return user?.roles?.some((role) => role.name === roleName) || false;
    },
    hasPermission: (permissionName: string) => {
      const user = auth.user as AuthUser | null;
      if (!user?.roles) return false;

      return user.roles.some((role) =>
        role.permissions?.some(
          (perm) => perm.permission?.name === permissionName,
        ),
      );
    },
  };
}

export default useAuth;
