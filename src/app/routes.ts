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

  // Orders - Full page routes (no modals)
  ORDERS: "/orders",
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
  DAILY_MENU: "/menu/daily",
  STOCK_MANAGEMENT: "/menu/stock",

  // Tables
  TABLES: "/tables",
  TABLE_CREATE: "/tables/new",
  TABLE_MANAGE: "/tables/:id",

  // Users (Admin only)
  USERS: "/users",
  USER_CREATE: "/users/new",
  USER_EDIT: "/users/:id/edit",

  // Profile
  PROFILE: "/profile",
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
