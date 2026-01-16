import { useAuth } from "./useAuth";
import { RoleName } from "@/types";

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
   * Checks if the user has a specific role
   * 
   * @param role - Role name to check
   * @returns true if user has the role
   */
  const hasRole = (role: RoleName): boolean => {
    if (!user || !user.roles) return false;
    return user.roles.some((r) => r.name === role);
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
   * Note: SuperAdmin is determined by having ADMIN role
   * and potentially a special permission. For now, we'll
   * check if user is ADMIN - you can add permission check later.
   */
  const isSuperAdmin = (): boolean => {
    // For MVP: SuperAdmin is ADMIN
    // Later you can add permission check: hasPermission("SUPER_ADMIN")
    return hasRole(RoleName.ADMIN);
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
    user,
  };
}
