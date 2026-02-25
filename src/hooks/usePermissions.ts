import { useAuth } from "./useAuth";
import { RoleName, type UserRole, type Role } from "@/types";

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
   * Handles both UserRole structure (with nested role) and direct Role structure
   */
  const getUserRoleNames = (): RoleName[] => {
    if (!user || !user.roles) return [];

    return user.roles.map((userRoleOrRole) => {
      // Check if it's UserRole structure (has role property)
      if ("role" in userRoleOrRole) {
        const userRole = userRoleOrRole as UserRole;
        return userRole.role.name;
      }
      // Direct Role structure
      const role = userRoleOrRole as Role;
      return role.name;
    });
  };

  /**
   * Checks if the user has a specific role
   * 
   * @param role - Role name to check
   * @returns true if user has the role
   */
  const hasRole = (role: RoleName): boolean => {
    const userRoles = getUserRoleNames();
    return userRoles.includes(role);
  };

  /**
   * Checks if the user has any of the specified roles
   * 
   * @param roles - Array of role names to check
   * @returns true if user has at least one of the roles
   */
  const hasAnyRole = (roles: RoleName[]): boolean => {
    return roles.some((role) => hasRole(role));
  };

  /**
   * Checks if the user has all of the specified roles
   * 
   * @param roles - Array of role names to check
   * @returns true if user has all roles
   */
  const hasAllRoles = (roles: RoleName[]): boolean => {
    return roles.every((role) => hasRole(role));
  };

  /**
   * Checks if the user is an admin (ADMIN or SUPER_ADMIN)
   */
  const isAdmin = (): boolean => {
    return hasAnyRole([RoleName.ADMIN]);
  };

  /**
   * Checks if the user is a super admin
   */
  const isSuperAdmin = (): boolean => {
    return hasRole(RoleName.SUPERADMIN);
  };

  /**
   * Checks if the user is an employee (has access to dashboard)
   */
  const isEmployee = (): boolean => {
    return hasAnyRole([
      RoleName.ADMIN,
      RoleName.WAITER,
      RoleName.KITCHEN_MANAGER,
      RoleName.CASHIER,
    ]);
  };

  return {
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isAdmin,
    isSuperAdmin,
    isEmployee,
    getUserRoleNames,
    user,
  };
}
