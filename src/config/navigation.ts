/**
 * NAVIGATION CONFIGURATION
 *
 * Centralized navigation configuration with role-based access control.
 * Each navigation item defines which roles can access it.
 */

import {
  Home,
  LayoutGrid,
  MenuIcon,
  ShoppingCart,
  Users,
  ChefHat,
  type LucideIcon,
} from "lucide-react";
import { RoleName } from "@/types";
import { ROUTES } from "@/app/routes";

/**
 * Navigation item configuration
 */
export interface NavigationItem {
  name: string;
  path: string;
  icon: LucideIcon;
  /**
   * Roles that can access this navigation item.
   * If empty array, all authenticated users can access.
   * If undefined, no one can access (useful for future features).
   */
  allowedRoles?: RoleName[];
  /**
   * Optional description for accessibility
   */
  description?: string;
}

/**
 * Navigation items configuration
 *
 * Based on user roles:
 * - Client: No dashboard access
 * - Waiter: Create/edit orders, view orders/statuses
 * - Kitchen Manager: View orders by arrival, change statuses
 * - Admin: Manage waiters/kitchen, edit other profiles
 * - SuperAdmin: Full role/permission management (same as Admin for MVP)
 */
export const navigationItems: NavigationItem[] = [
  {
    name: "Dashboard",
    path: ROUTES.DASHBOARD,
    icon: Home,
    allowedRoles: [
      RoleName.ADMIN,
      RoleName.WAITER,
      RoleName.KITCHEN_MANAGER,
      RoleName.CASHIER,
    ],
    description: "Panel principal con estadísticas y resumen",
  },
  {
    name: "Mesas",
    path: ROUTES.TABLES,
    icon: LayoutGrid,
    allowedRoles: [
      RoleName.ADMIN,
      RoleName.WAITER,
      RoleName.CASHIER,
    ],
    description: "Gestión de mesas del restaurante",
  },
  {
    name: "Menú",
    path: ROUTES.MENU,
    icon: MenuIcon,
    allowedRoles: [
      RoleName.ADMIN,
      RoleName.WAITER,
      RoleName.KITCHEN_MANAGER,
      RoleName.CASHIER,
    ],
    description: "Gestión de categorías y productos del menú",
  },
  {
    name: "Pedidos",
    path: ROUTES.ORDERS,
    icon: ShoppingCart,
    allowedRoles: [
      RoleName.ADMIN,
      RoleName.WAITER,
      RoleName.KITCHEN_MANAGER,
      RoleName.CASHIER,
    ],
    description: "Gestión de pedidos y órdenes",
  },
  {
    name: "Cocina",
    path: ROUTES.KITCHEN,
    icon: ChefHat,
    allowedRoles: [RoleName.KITCHEN_MANAGER, RoleName.ADMIN],
    description: "Vista de cocina - órdenes por llegada",
  },
  {
    name: "Usuarios",
    path: ROUTES.USERS,
    icon: Users,
    allowedRoles: [RoleName.ADMIN],
    description: "Gestión de usuarios y roles (solo administradores)",
  },
];

/**
 * Get navigation items filtered by user roles
 *
 * @param userRoles - Array of role names the user has
 * @returns Filtered navigation items the user can access
 */
export function getFilteredNavigationItems(
  userRoles: RoleName[],
): NavigationItem[] {
  return navigationItems.filter((item) => {
    // If no allowedRoles specified, allow all authenticated users
    if (!item.allowedRoles || item.allowedRoles.length === 0) {
      return true;
    }

    // Check if user has at least one of the allowed roles
    return item.allowedRoles.some((role) => userRoles.includes(role));
  });
}
