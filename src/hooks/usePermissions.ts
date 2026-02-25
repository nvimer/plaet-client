import { useAuth } from "./useAuth";
import { RoleName, type UserRole, type Role } from "@/types";
import { useMemo } from "react";

/**
 * usePermissions Hook
 * 
 * Provides utilities to check user roles and permissions.
 * This hook centralizes permission checking logic.
 * 
 * @returns Object with permission checking functions
 */
export function usePermissions() {
  const { user } = useAuth();

  /**
   * Extract role names from user roles
   */
  const getUserRoleNames = useMemo((): RoleName[] => {
    if (!user || !user.roles) return [];

    return user.roles.map((userRoleOrRole) => {
      if ("role" in userRoleOrRole) {
        const userRole = userRoleOrRole as UserRole;
        return userRole.role.name;
      }
      const role = userRoleOrRole as Role;
      return role.name;
    });
  }, [user]);

  /**
   * Extract all unique permissions from all user roles
   * Result is a Set for O(1) lookups
   */
  const permissions = useMemo((): Set<string> => {
    const permSet = new Set<string>();
    if (!user || !user.roles) return permSet;

    user.roles.forEach((userRoleOrRole) => {
      // We need the variant that has the role property and permissions inside
      if ("role" in userRoleOrRole) {
        const userRole = userRoleOrRole as any; // Using any here because of complex nested structure in TS
        const rolePermissions = userRole.role.permissions;
        
        if (Array.isArray(rolePermissions)) {
          rolePermissions.forEach((rp: any) => {
            if (rp.permission?.name) {
              permSet.add(rp.permission.name);
            }
          });
        }
      }
    });

    return permSet;
  }, [user]);

  /**
   * Checks if the user has a specific permission by name
   */
  const hasPermission = (permissionName: string): boolean => {
    // SuperAdmin always has all permissions
    if (isSuperAdmin()) return true;
    return permissions.has(permissionName);
  };

  /**
   * Checks if the user has a specific role
   */
  const hasRole = (role: RoleName): boolean => {
    return getUserRoleNames.includes(role);
  };

  /**
   * Checks if the user has any of the specified roles
   */
  const hasAnyRole = (roles: RoleName[]): boolean => {
    return roles.some((role) => hasRole(role));
  };

  /**
   * Checks if the user is a super admin
   */
  const isSuperAdmin = (): boolean => {
    return getUserRoleNames.includes(RoleName.SUPERADMIN);
  };

  /**
   * Checks if the user is an admin
   */
  const isAdmin = (): boolean => {
    return hasAnyRole([RoleName.ADMIN]);
  };

  return {
    hasRole,
    hasAnyRole,
    hasPermission,
    isSuperAdmin,
    isAdmin,
    permissions,
    user,
  };
}
