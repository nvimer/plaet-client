/**
 * USE ENHANCED AUTH HOOK
 *
 * Custom hook to use the enhanced authentication context
 * Provides type-safe access to auth functionality
 */

import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { AuthContext as EnhancedAuthContext } from "@/contexts/EnhancedAuthContext";

/**
 * Enhanced useAuth hook
 *
 * Provides access to authentication state and functions.
 * Automatically detects which context is available.
 */
export function useAuth() {
  // Try enhanced context first
  const enhancedContext = useContext(EnhancedAuthContext);
  if (enhancedContext) {
    return enhancedContext;
  }

  // Fallback to original context
  const originalContext = useContext(AuthContext);
  if (originalContext) {
    return originalContext as any;
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
    error: auth.error,
    lastActivity: auth.lastActivity,
  };
}

/**
 * Hook for authentication actions only
 */
export function useAuthActions() {
  const auth = useAuth();

  return {
    login: auth.login,
    register: auth.register,
    logout: auth.logout,
    refreshToken: auth.refreshToken,
    checkAuth: auth.checkAuth,
    clearError: auth.clearError,
    updateUser: auth.updateUser,
  };
}

/**
 * Hook for user information only
 */
export function useUser() {
  const auth = useAuth();

  return {
    user: auth.user,
    updateUser: auth.updateUser,
    hasRole: (roleName: string) => {
      return (
        auth.user?.roles?.some((role: any) => role.name === roleName) || false
      );
    },
    hasPermission: (permissionName: string) => {
      if (!auth.user?.roles) return false;

      return auth.user.roles.some((role: any) =>
        role.permissions?.some(
          (perm: any) => perm.permission?.name === permissionName,
        ),
      );
    },
  };
}

export default useAuth;
