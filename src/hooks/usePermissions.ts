import { useAuth } from "./useAuth";
import { RoleName, type UserRole, type Role } from "@/types";
import { useMemo } from "react";

/**
 * Local interface for nested permission structure
 */
interface NestedUserRole {
  role: {
    name: RoleName;
    permissions?: Array<{
      permission: {
        name: string;
      };
    }>;
  };
}

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
      // 1. Handle string variant
      if (typeof userRoleOrRole === "string") {
        return userRoleOrRole as RoleName;
      }
      
      // 2. Handle UserRole relation variant (has .role property)
      if (userRoleOrRole && typeof userRoleOrRole === "object" && "role" in userRoleOrRole) {
        const userRole = userRoleOrRole as UserRole;
        return userRole.role.name;
      }
      
      // 3. Handle direct Role object variant (has .name property)
      const role = userRoleOrRole as Role;
      return role.name;
    }).filter(Boolean) as RoleName[];
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
      if (userRoleOrRole && typeof userRoleOrRole === "object" && "role" in userRoleOrRole) {
        const userRole = userRoleOrRole as unknown as NestedUserRole;
        const rolePermissions = userRole.role.permissions;
        
        if (Array.isArray(rolePermissions)) {
          rolePermissions.forEach((rp) => {
            if (rp.permission?.name) {
              permSet.add(rp.permission.name);
            }
          });
        }
      } else if (userRoleOrRole && typeof userRoleOrRole === "object" && "permissions" in userRoleOrRole) {
        // Direct Role with permissions
        const role = userRoleOrRole as unknown as { permissions?: Array<{ permission?: { name: string } }> };
        role.permissions?.forEach((rp) => {
          if (rp.permission?.name) {
            permSet.add(rp.permission.name);
          }
        });
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
    getUserRoleNames,
  };
}
