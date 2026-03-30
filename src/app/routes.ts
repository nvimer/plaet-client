/**
 * APPLICATION ROUTES
 *
 * Centralized route definitions for the application.
 * This ensures type safety and easy refactoring.
 */

const BASE_ROUTES = {
  // Public routes
  HOME: "/",
  LOGIN: "/login",

  // Dashboard
  DASHBOARD: "/dashboard",
  ADMIN: "/admin",
  ADMIN_DASHBOARD: "/admin/dashboard",
  RESTAURANTS: "/admin/restaurants",
  PERMISSIONS: "/admin/permissions",
  CASH_CLOSURE: "/admin/cash-closure",
  EXPENSES: "/admin/expenses",

  // Roles (Admin only)
  ROLES: "/admin/roles",
  ROLE_CREATE: "/admin/roles/new",
  ROLE_EDIT: "/admin/roles/:id/edit",

  // Orders Hub
  ORDERS: "/orders",
  ORDERS_LIST: "/orders/list",
  ORDER_CREATE: "/orders/new",
  ORDER_DETAIL: "/orders/:id",
  ORDER_EDIT: "/orders/:id/edit",
  KITCHEN: "/kitchen",

  // Menu
  MENU: "/menu",
  MENU_LIST: "/menu/list",
  MENU_ITEM_CREATE: "/menu/items/new",
  MENU_ITEM_EDIT: "/menu/items/:id/edit",
  MENU_CATEGORY_CREATE: "/menu/categories/new",
  MENU_CATEGORY_EDIT: "/menu/categories/:id/edit",
  
  // Inventory Hub
  INVENTORY: "/inventory",
  STOCK_MANAGEMENT: "/inventory/stock",
  INVENTORY_HISTORY: "/inventory/history",
  
  // Daily Menu Hub
  DAILY_MENU: "/daily-menu",
  DAILY_MENU_SETUP: "/daily-menu/setup",
  DAILY_MENU_HISTORY: "/daily-menu/history",

  // Tables Hub
  TABLES: "/tables",
  TABLES_MAP: "/tables/map",
  TABLE_CREATE: "/tables/new",
  TABLE_MANAGE: "/tables/:id",

  // Users (Admin only)
  USERS: "/users",
  USERS_LIST: "/users/list",
  USER_CREATE: "/users/new",
  USER_EDIT: "/users/:id/edit",

  // Customers
  CUSTOMERS: "/customers",
  CUSTOMERS_LIST: "/customers/list",

  // Profile
  PROFILE: "/profile",
  CHANGE_PASSWORD: "/profile/change-password",

  // Auth
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY_EMAIL: "/verify-email",
  LOCKOUT: "/lockout",
  ERROR: "/error",
} as const;

/**
 * Helper functions to generate routes with parameters
 */
export const getOrderDetailRoute = (id: string | number) => `/orders/${id}` as const;
export const getOrderEditRoute = (id: string | number) => `/orders/${id}/edit` as const;
export const getMenuItemEditRoute = (id: string | number) => `/menu/items/${id}/edit` as const;
export const getCategoryEditRoute = (id: string | number) => `/menu/categories/${id}/edit` as const;
export const getTableManageRoute = (id: string | number) => `/tables/${id}` as const;
export const getUserEditRoute = (id: string | number) => `/users/${id}/edit` as const;
export const getRoleEditRoute = (id: string | number) => `/admin/roles/${id}/edit` as const;

/**
 * ROUTES Object with helper functions
 */
export const ROUTES = {
  ...BASE_ROUTES,
  getOrderDetailRoute,
  getOrderEditRoute,
  getMenuItemEditRoute,
  getCategoryEditRoute,
  getTableManageRoute,
  getUserEditRoute,
  getRoleEditRoute,
};
