/**
 * Breadcrumb configuration for TopBar.
 * Maps route pathnames to breadcrumb items (label + optional path for links).
 */

export interface BreadcrumbItem {
  /** Display label */
  label: string;
  /** Link path - omit for current page */
  path?: string;
}

/**
 * Static breadcrumb config for exact pathnames.
 * Order matters for prefix matching in getBreadcrumbs.
 */
const BREADCRUMB_MAP: Array<{ path: string; items: BreadcrumbItem[] }> = [
  // Dashboard
  {
    path: "/dashboard",
    items: [{ label: "Inicio" }],
  },
  // Tables
  {
    path: "/tables",
    items: [{ label: "Inicio", path: "/dashboard" }, { label: "Mesas" }],
  },
  {
    path: "/tables/new",
    items: [
      { label: "Inicio", path: "/dashboard" },
      { label: "Mesas", path: "/tables" },
      { label: "Nueva mesa" },
    ],
  },
  // Orders
  {
    path: "/orders",
    items: [{ label: "Inicio", path: "/dashboard" }, { label: "Pedidos" }],
  },
  {
    path: "/orders/new",
    items: [
      { label: "Inicio", path: "/dashboard" },
      { label: "Pedidos", path: "/orders" },
      { label: "Nuevo pedido" },
    ],
  },
  {
    path: "/kitchen",
    items: [
      { label: "Inicio", path: "/dashboard" },
      { label: "Pedidos", path: "/orders" },
      { label: "Cocina" },
    ],
  },
  // Menu
  {
    path: "/menu",
    items: [{ label: "Inicio", path: "/dashboard" }, { label: "Menú" }],
  },
  {
    path: "/menu/items/new",
    items: [
      { label: "Inicio", path: "/dashboard" },
      { label: "Menú", path: "/menu" },
      { label: "Nuevo producto" },
    ],
  },
  {
    path: "/menu/categories/new",
    items: [
      { label: "Inicio", path: "/dashboard" },
      { label: "Menú", path: "/menu" },
      { label: "Nueva categoría" },
    ],
  },
  {
    path: "/menu/stock",
    items: [
      { label: "Inicio", path: "/dashboard" },
      { label: "Menú", path: "/menu" },
      { label: "Inventario" },
    ],
  },
  // Users
  {
    path: "/users",
    items: [{ label: "Inicio", path: "/dashboard" }, { label: "Usuarios" }],
  },
  {
    path: "/users/new",
    items: [
      { label: "Inicio", path: "/dashboard" },
      { label: "Usuarios", path: "/users" },
      { label: "Nuevo usuario" },
    ],
  },
  // Profile
  {
    path: "/profile",
    items: [{ label: "Inicio", path: "/dashboard" }, { label: "Mi perfil" }],
  },
];

/**
 * Get breadcrumb items for a pathname.
 * Tries exact match first, then prefix match for dynamic routes (e.g. /tables/5, /orders/5/edit).
 */
export function getBreadcrumbs(pathname: string): BreadcrumbItem[] {
  // Normalize: remove trailing slash
  const normalized = pathname.replace(/\/$/, "") || "/";

  // Exact match
  const exact = BREADCRUMB_MAP.find((entry) => entry.path === normalized);
  if (exact) return exact.items;

  // Dynamic routes: match by prefix
  // /tables/123 -> Mesas > Gestionar mesa
  // /tables/123/edit -> not used (we don't have edit for tables)
  // /orders/123 -> Pedidos > Pedido #123
  // /orders/123/edit -> Pedidos > Pedido #123 > Editar
  // /menu/items/123/edit -> Menú > Productos > Editar
  // /menu/categories/123/edit -> Menú > Categorías > Editar
  // /users/123/edit -> Usuarios > Editar usuario

  const segments = normalized.split("/").filter(Boolean);

  if (segments[0] === "tables" && segments.length >= 2) {
    const id = segments[1];
    return [
      { label: "Inicio", path: "/dashboard" },
      { label: "Mesas", path: "/tables" },
      { label: id === "new" ? "Nueva mesa" : `Mesa ${id}` },
    ];
  }
  if (segments[0] === "orders" && segments.length >= 2) {
    const id = segments[1];
    const base = [
      { label: "Inicio", path: "/dashboard" },
      { label: "Pedidos", path: "/orders" },
    ];
    if (id === "new") return [...base, { label: "Nuevo pedido" }];
    if (segments[2] === "edit") return [...base, { label: `Pedido #${id}` }, { label: "Editar" }];
    return [...base, { label: `Pedido #${id}` }];
  }
  if (segments[0] === "menu") {
    const base = [{ label: "Inicio", path: "/dashboard" }, { label: "Menú", path: "/menu" }];
    if (segments[1] === "items") {
      if (segments[2] === "new") return [...base, { label: "Nuevo producto" }];
      if (segments[3] === "edit") return [...base, { label: "Editar producto" }];
      return [...base, { label: "Productos" }];
    }
    if (segments[1] === "categories") {
      if (segments[2] === "new") return [...base, { label: "Nueva categoría" }];
      if (segments[3] === "edit") return [...base, { label: "Editar categoría" }];
      return [...base, { label: "Categorías" }];
    }
    if (segments[1] === "stock") return [...base, { label: "Inventario" }];
    return base;
  }
  if (segments[0] === "users" && segments.length >= 2) {
    const id = segments[1];
    const base = [{ label: "Inicio", path: "/dashboard" }, { label: "Usuarios", path: "/users" }];
    if (id === "new") return [...base, { label: "Nuevo usuario" }];
    if (segments[2] === "edit") return [...base, { label: "Editar usuario" }];
    return base;
  }

  // Fallback: single item
  return [{ label: "Inicio", path: "/dashboard" }];
}
