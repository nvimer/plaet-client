/**
 * USE ENHANCED AUTH HOOK
 *
 * Custom hook to use the enhanced authentication context
 * Provides type-safe access to auth functionality
 */

import { useContext } from "react";
import { AuthContext } from "@/contexts/EnhancedAuthContext";
import type { Role, UserRole } from "@/types";

/**
 * Enhanced useAuth hook
 *
 * Provides access to authentication state and functions.
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
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
      if (!auth.user?.roles) return false;
      
      return auth.user.roles.some((roleEntry) => {
        // Handle both Role and UserRole structures
        const role = 'role' in roleEntry ? (roleEntry as UserRole).role : (roleEntry as Role);
        return role.name === roleName;
      });
    },
    hasPermission: (permissionName: string) => {
      if (!auth.user?.roles) return false;

      return auth.user.roles.some((roleEntry) => {
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
