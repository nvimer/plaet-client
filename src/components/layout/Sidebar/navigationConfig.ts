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
  Receipt,
  Settings,
  Building2,
  ShieldCheck,
  Package,
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
  id: string; // Added unique ID
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

  const menuChildren: NavChild[] = [
    {
      type: "link",
      path: ROUTES.MENU,
      name: "Catálogo completo",
      icon: Grid3x3,
    },
    {
      type: "link",
      path: ROUTES.DAILY_MENU,
      name: "Menú del Día",
      icon: ChefHat,
    },
    {
      type: "divider",
      path: "",
      name: "divider",
      icon: Package,
    },
    {
      type: "link",
      path: ROUTES.MENU_ITEM_CREATE,
      name: "Nuevo producto",
      icon: Plus,
    },
  ];

  return [
    {
      id: "dashboard",
      path: ROUTES.DASHBOARD,
      name: "Dashboard",
      icon: Home,
      description: "Vista general",
    },
    {
      id: "tables",
      path: ROUTES.TABLES,
      name: "Mesas",
      icon: LayoutGrid,
      description: "Mapa de sala",
    },
    {
      id: "inventory",
      path: ROUTES.STOCK_MANAGEMENT,
      name: "Inventario",
      icon: Package2,
      description: "Stock y alertas",
    },
    {
      id: "menu-group",
      path: ROUTES.MENU,
      name: "Menú",
      icon: Menu,
      description: "Carta y categorías",
      children: menuChildren,
    },
    {
      id: "orders-group",
      path: ROUTES.ORDERS,
      name: "Ventas",
      icon: ShoppingCart,
      description: "Pedidos y facturación",
      children: [
        {
          type: "link",
          path: ROUTES.ORDERS,
          name: "Historial de Pedidos",
          icon: ShoppingCart,
        },
        { type: "link", path: ROUTES.KITCHEN, name: "Monitor de Cocina", icon: ChefHat },
        {
          type: "link",
          path: ROUTES.ORDER_CREATE,
          name: "Nuevo Pedido",
          icon: Plus,
        },
      ],
    },
    {
      id: "admin-group",
      path: "/admin",
      name: "Administración",
      icon: Settings,
      description: "Finanzas y cierres",
      children: [
        {
          type: "link",
          path: ROUTES.ADMIN_DASHBOARD,
          name: "Analítica",
          icon: BarChart3,
        },
        {
          type: "link",
          path: ROUTES.CASH_CLOSURE,
          name: "Cuadre de Caja",
          icon: Wallet,
        },
        {
          type: "link",
          path: ROUTES.EXPENSES,
          name: "Gestión de Gastos",
          icon: Receipt,
        },
      ],
    },
    {
      id: "users",
      path: ROUTES.USERS,
      name: "Equipo",
      icon: Users,
      description: "Personal y roles",
    },
  ];
};