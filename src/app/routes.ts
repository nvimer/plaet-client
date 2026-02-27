/**
 * APPLICATION ROUTES
 *
 * Centralized route definitions for the application.
 * This ensures type safety and easy refactoring.
 *
 * All routes follow the pattern: /feature/action
 * - List views: /feature
 * - Create: /feature/new
 * - Detail: /feature/:id
 * - Edit: /feature/:id/edit
 */

export const ROUTES = {
  // Public routes
  HOME: "/",
  LOGIN: "/login",

  // Dashboard
  DASHBOARD: "/dashboard",
  ADMIN_DASHBOARD: "/admin/dashboard",
  RESTAURANTS: "/admin/restaurants",
  PERMISSIONS: "/admin/permissions",
  CASH_CLOSURE: "/admin/cash-closure",
  EXPENSES: "/admin/expenses",

  // Orders Hub
  ORDERS: "/orders",
  ORDERS_LIST: "/orders/list",
  ORDER_CREATE: "/orders/new",
  ORDER_DETAIL: "/orders/:id",
  ORDER_EDIT: "/orders/:id/edit",
  KITCHEN: "/kitchen",

  // Menu
  MENU: "/menu",
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

  // Profile
  PROFILE: "/profile",
  CHANGE_PASSWORD: "/profile/change-password",

  // Auth
  VERIFY_EMAIL: "/verify-email",
  LOCKOUT: "/lockout",
  ERROR: "/error",
} as const;

/**
 * Helper functions to generate routes with parameters
 */
export const getOrderDetailRoute = (id: string | number) => `/orders/${id}`;
export const getOrderEditRoute = (id: string | number) => `/orders/${id}/edit`;
export const getMenuItemEditRoute = (id: string | number) =>
  `/menu/items/${id}/edit`;
export const getCategoryEditRoute = (id: string | number) =>
  `/menu/categories/${id}/edit`;
export const getTableManageRoute = (id: string | number) => `/tables/${id}`;
export const getUserEditRoute = (id: string | number) => `/users/${id}/edit`;
