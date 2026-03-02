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
  Package,
  Calendar,
  UtensilsCrossed,
} from "lucide-react";
import { ROUTES } from "@/app/routes";
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
}

export interface NavItem {
  id: string;
  path: string;
  name: string;
  icon: LucideIcon;
  description?: string;
  badge?: string;
  children?: NavChild[];
}

export const getNavigationItems = (role: string, isSuperAdmin: boolean): NavItem[] => {
  if (isSuperAdmin) {
    return [
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
        name: "Roles y Permisos",
        icon: ShieldCheck,
        description: "Matriz de seguridad",
      },
    ];
  }

  return [
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
      children: [
        { type: "link", path: ROUTES.TABLES_MAP, name: "Mapa de Sala", icon: LayoutGrid },
        { type: "link", path: ROUTES.TABLE_CREATE, name: "Nueva Mesa", icon: Plus },
      ]
    },
    {
      id: "orders-hub",
      path: ROUTES.ORDERS,
      name: "Ventas",
      icon: ShoppingCart,
      description: "Pedidos y facturación",
      children: [
        { type: "link", path: ROUTES.ORDERS_LIST, name: "Historial de Pedidos", icon: ShoppingCart },
        { type: "link", path: ROUTES.KITCHEN, name: "Monitor de Cocina", icon: ChefHat },
        { type: "link", path: ROUTES.ORDER_CREATE, name: "Nuevo Pedido", icon: Plus },
      ],
    },
    {
      id: "daily-menu-hub",
      path: ROUTES.DAILY_MENU,
      name: "Menú del Día",
      icon: UtensilsCrossed,
      description: "Configuración diaria",
      children: [
        { type: "link", path: ROUTES.DAILY_MENU_SETUP, name: "Configurar Hoy", icon: ChefHat },
        { type: "link", path: ROUTES.DAILY_MENU_HISTORY, name: "Historial", icon: Calendar },
      ]
    },
    {
      id: "inventory-hub",
      path: ROUTES.INVENTORY,
      name: "Inventario",
      icon: Package2,
      description: "Control de insumos",
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
      children: [
        { type: "link", path: ROUTES.MENU_LIST, name: "Lista de Productos", icon: Grid3x3 },
        { type: "link", path: ROUTES.MENU_CATEGORY_CREATE, name: "Nueva Categoría", icon: Plus },
        { type: "link", path: ROUTES.MENU_ITEM_CREATE, name: "Nuevo Producto", icon: Plus },
      ],
    },
    {
      id: "admin-group",
      path: "/admin",
      name: "Administración",
      icon: Settings,
      description: "Finanzas y reportes",
      children: [
        { type: "link", path: ROUTES.ADMIN_DASHBOARD, name: "Analítica", icon: BarChart3 },
        { type: "link", path: ROUTES.CASH_CLOSURE, name: "Cuadre de Caja", icon: Wallet },
        { type: "link", path: ROUTES.EXPENSES, name: "Gestión de Gastos", icon: ReceiptText },
      ],
    },
    {
      id: "users-hub",
      path: ROUTES.USERS,
      name: "Equipo",
      icon: Users,
      description: "Personal y roles",
      children: [
        { type: "link", path: ROUTES.USERS_LIST, name: "Lista de Equipo", icon: Users },
        { type: "link", path: ROUTES.USER_CREATE, name: "Nuevo Usuario", icon: Plus },
        { type: "link", path: ROUTES.PERMISSIONS, name: "Roles y Permisos", icon: ShieldCheck },
      ]
    },
  ];
};
