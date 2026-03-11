/**
 * USE ENHANCED AUTH HOOK
 *
 * Custom hook to use the enhanced authentication store (Zustand)
 * Provides type-safe access to auth functionality
 * 
 * Migrated from Context API to Zustand for better performance.
 */

import { useAuthStore } from "@/stores/useAuthStore";
import type { Role, UserRole } from "@/types";

/**
 * Enhanced useAuth hook
 *
 * Provides access to authentication state and functions.
 */
export function useAuth() {
  return useAuthStore();
}

/**
 * Hook for authentication state only
 */
export function useAuthState() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const lastActivity = useAuthStore((state) => state.lastActivity);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    lastActivity,
  };
}

/**
 * Hook for authentication actions only
 */
export function useAuthActions() {
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const logout = useAuthStore((state) => state.logout);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const clearError = useAuthStore((state) => state.clearError);
  const updateUser = useAuthStore((state) => state.updateUser);

  return {
    login,
    register,
    logout,
    refreshToken,
    checkAuth,
    clearError,
    updateUser,
  };
}

/**
 * Hook for user information only
 */
export function useUser() {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);

  return {
    user,
    updateUser,
    hasRole: (roleName: string) => {
      if (!user?.roles) return false;
      
      return user.roles.some((roleEntry) => {
        // Handle both Role and UserRole structures
        const role = 'role' in roleEntry ? (roleEntry as UserRole).role : (roleEntry as Role);
        return role.name === roleName;
      });
    },
    hasPermission: (permissionName: string) => {
      if (!user?.roles) return false;

      return user.roles.some((roleEntry) => {
        // Safe check for UserRole structure with nested permissions
        if ('role' in roleEntry) {
          const userRole = roleEntry as UserRole & { 
            role: Role & { permissions?: Array<{ permission?: { name: string } }> } 
          };
          return userRole.role.permissions?.some(
            (perm) => perm.permission?.name === permissionName,
          );
        }
        return false;
      });
    },
  };
}

export default useAuth;
