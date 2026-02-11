/**
 * APPLICATION ROUTES
 * 
 * Define all routes here for:
 * 1. TypeScript autocompletion
 * 2. Prevent typos
 * 3. Easy refactoring (change route in one place)
 * 
 * 'as const' makes TypeScript treat these values as literals
 * instead of just strings, providing better type checking
 */

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  
  // Orders
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:id', // :id is a dynamic parameter
  ORDER_NEW: '/orders/new',
  
  // Menu
  MENU: '/menu',
  MENU_ITEM_DETAIL: '/menu/:id',
  
  // Tables
  TABLES: '/tables',
  
  // Perfil
  PROFILE: '/profile',
} as const;

/**
 * Funciones helper para generar rutas con parámetros
 */
export const getOrderDetailRoute = (orderId: string | number) => 
  `/orders/${orderId}`;

export const getMenuItemDetailRoute = (itemId: string | number) => 
  `/menu/${itemId}`;
