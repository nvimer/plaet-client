import {
  Home,
  LayoutGrid,
  ShoppingCart,
  Users,
  ChefHat,
  Menu,
  Package2,
  Grid3x3,
  Plus,
  BarChart3,
  Wallet,
  ReceiptText,
  Settings,
  Building2,
  ShieldCheck,
  Calendar,
  UtensilsCrossed,
  History,
} from "lucide-react";
import { ROUTES } from "@/app/routes";
import { RoleName } from "@/types";
import type { LucideIcon } from "lucide-react";

export interface NavSubLink {
  path: string;
  name: string;
  icon: LucideIcon;
}

export interface NavChild {
  type: "link" | "divider" | "expandable";
  path: string;
  name: string;
  icon: LucideIcon;
  badge?: string;
  children?: NavSubLink[];
  allowedRoles?: RoleName[];
  requiredPermission?: string;
}

export interface NavItem {
  id: string;
  path: string;
  name: string;
  icon: LucideIcon;
  description?: string;
  badge?: string;
  children?: NavChild[];
  allowedRoles?: RoleName[];
  requiredPermission?: string;
}

/**
 * Checks if a role or permission is allowed
 */
const isAuthorized = (
  userRole: string,
  isSuperAdmin: boolean,
  userPermissions?: Set<string>,
  allowedRoles?: RoleName[],
  requiredPermission?: string
): boolean => {
  if (isSuperAdmin) return true;

  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(userRole as RoleName)) return false;
  }

  if (requiredPermission) {
    if (!userPermissions?.has(requiredPermission)) return false;
  }

  return true;
};

export const getNavigationItems = (role: string, isSuperAdmin: boolean, userPermissions?: Set<string>): NavItem[] => {
  const rawItems: NavItem[] = isSuperAdmin ? [
    {
      id: "super-dashboard",
      path: ROUTES.DASHBOARD,
      name: "Dashboard Global",
      icon: Home,
      description: "Métricas del SaaS",
    },
    {
      id: "super-restaurants",
      path: ROUTES.RESTAURANTS,
      name: "Restaurantes",
      icon: Building2,
      description: "Gestionar inquilinos",
    },
    {
      id: "super-permissions",
      path: ROUTES.PERMISSIONS,
      name: "Matriz de Permisos",
      icon: ShieldCheck,
      description: "Configurar permisos",
    },
    {
      id: "super-roles",
      path: ROUTES.ROLES,
      name: "Roles",
      icon: Users,
      description: "Gestionar roles",
    },
  ] : [
    {
      id: "dashboard",
      path: ROUTES.DASHBOARD,
      name: "Inicio",
      icon: Home,
      description: "Centro de control",
    },
    {
      id: "tables-hub",
      path: ROUTES.TABLES,
      name: "Mesas",
      icon: LayoutGrid,
      description: "Gestión de sala",
      allowedRoles: [RoleName.ADMIN, RoleName.WAITER],
      children: [
        { type: "link", path: ROUTES.TABLES_MAP, name: "Mapa de Sala", icon: LayoutGrid },
        { type: "link", path: ROUTES.TABLE_CREATE, name: "Nueva Mesa", icon: Plus, allowedRoles: [RoleName.ADMIN] },
      ]
    },
    {
      id: "orders-hub",
      path: ROUTES.ORDERS,
      name: "Ventas",
      icon: ShoppingCart,
      description: "Pedidos y facturación",
      allowedRoles: [RoleName.ADMIN, RoleName.WAITER, RoleName.CASHIER, RoleName.KITCHEN_MANAGER],
      children: [
        { type: "link", path: ROUTES.ORDERS_LIST, name: "Historial de Pedidos", icon: History, allowedRoles: [RoleName.ADMIN, RoleName.WAITER, RoleName.CASHIER] },
        { type: "link", path: ROUTES.KITCHEN, name: "Monitor de Cocina", icon: ChefHat, allowedRoles: [RoleName.ADMIN, RoleName.KITCHEN_MANAGER, RoleName.WAITER] },
        { type: "link", path: ROUTES.ORDER_CREATE, name: "Nuevo Pedido", icon: Plus, allowedRoles: [RoleName.ADMIN, RoleName.WAITER, RoleName.CASHIER] },
      ],
    },
    {
      id: "daily-menu-hub",
      path: ROUTES.DAILY_MENU,
      name: "Menú del Día",
      icon: UtensilsCrossed,
      description: "Configuración diaria",
      allowedRoles: [RoleName.ADMIN, RoleName.KITCHEN_MANAGER],
      children: [
        { type: "link", path: ROUTES.DAILY_MENU_SETUP, name: "Configurar Hoy", icon: ChefHat, allowedRoles: [RoleName.ADMIN] },
        { type: "link", path: ROUTES.DAILY_MENU_HISTORY, name: "Historial", icon: Calendar, allowedRoles: [RoleName.ADMIN, RoleName.KITCHEN_MANAGER] },
      ]
    },
    {
      id: "inventory-hub",
      path: ROUTES.INVENTORY,
      name: "Inventario",
      icon: Package2,
      description: "Control de insumos",
      allowedRoles: [RoleName.ADMIN, RoleName.KITCHEN_MANAGER],
      children: [
        { type: "link", path: ROUTES.STOCK_MANAGEMENT, name: "Stock Actual", icon: Package2 },
        { type: "link", path: ROUTES.INVENTORY_HISTORY, name: "Movimientos", icon: ReceiptText },
      ]
    },
    {
      id: "menu-commercial",
      path: ROUTES.MENU,
      name: "Catálogo",
      icon: Menu,
      description: "Productos y precios",
      allowedRoles: [RoleName.ADMIN, RoleName.KITCHEN_MANAGER],
      children: [
        { type: "link", path: ROUTES.MENU_LIST, name: "Lista de Productos", icon: Grid3x3 },
        { type: "link", path: ROUTES.MENU_ITEM_CREATE, name: "Nuevo Producto", icon: Plus, allowedRoles: [RoleName.ADMIN] },
      ],
    },
    {
      id: "admin-group",
      path: ROUTES.ADMIN,
      name: "Administración",
      icon: Settings,
      description: "Finanzas y reportes",
      allowedRoles: [RoleName.ADMIN, RoleName.CASHIER],
      children: [
        { type: "link", path: ROUTES.ADMIN_DASHBOARD, name: "Analítica", icon: BarChart3, allowedRoles: [RoleName.SUPERADMIN] },
        { type: "link", path: ROUTES.CASH_CLOSURE, name: "Cuadre de Caja", icon: Wallet },
        { type: "link", path: ROUTES.EXPENSES, name: "Gestión de Gastos", icon: ReceiptText, allowedRoles: [RoleName.SUPERADMIN] },
      ],
    },
    {
      id: "users-hub",
      path: ROUTES.USERS,
      name: "Personas",
      icon: Users,
      description: "Personal y clientes",
      allowedRoles: [RoleName.ADMIN, RoleName.CASHIER],
      children: [
        { type: "link", path: ROUTES.USERS_LIST, name: "Lista de Equipo", icon: ShieldCheck, allowedRoles: [RoleName.SUPERADMIN] },
        { type: "link", path: ROUTES.CUSTOMERS_LIST, name: "Lista de Clientes", icon: Users },
        { type: "link", path: ROUTES.USER_CREATE, name: "Nuevo Usuario", icon: Plus, allowedRoles: [RoleName.SUPERADMIN] },
        { type: "link", path: ROUTES.ROLES, name: "Gestionar Roles", icon: ShieldCheck, allowedRoles: [RoleName.SUPERADMIN] },
      ]
    },
  ];

  // Filter items recursively based on authorization
  return rawItems
    .filter(item => isAuthorized(role, isSuperAdmin, userPermissions, item.allowedRoles, item.requiredPermission))
    .map(item => ({
      ...item,
      children: item.children?.filter(child => 
        isAuthorized(role, isSuperAdmin, userPermissions, child.allowedRoles, child.requiredPermission)
      )
    }));
};
