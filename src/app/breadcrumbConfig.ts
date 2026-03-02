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
  
  // Tables Hub
  {
    path: "/tables",
    items: [{ label: "Inicio", path: "/dashboard" }, { label: "Mesas" }],
  },
  {
    path: "/tables/map",
    items: [
      { label: "Inicio", path: "/dashboard" },
      { label: "Mesas", path: "/tables" },
      { label: "Mapa de Sala" },
    ],
  },
  {
    path: "/tables/new",
    items: [
      { label: "Inicio", path: "/dashboard" },
      { label: "Mesas", path: "/tables" },
      { label: "Nueva mesa" },
    ],
  },

  // Inventory Hub
  {
    path: "/inventory",
    items: [{ label: "Inicio", path: "/dashboard" }, { label: "Inventario" }],
  },
  {
    path: "/inventory/stock",
    items: [
      { label: "Inicio", path: "/dashboard" },
      { label: "Inventario", path: "/inventory" },
      { label: "Stock Actual" },
    ],
  },
  {
    path: "/inventory/history",
    items: [
      { label: "Inicio", path: "/dashboard" },
      { label: "Inventario", path: "/inventory" },
      { label: "Historial de Movimientos" },
    ],
  },

  // Daily Menu Hub
  {
    path: "/daily-menu",
    items: [{ label: "Inicio", path: "/dashboard" }, { label: "Menú del Día" }],
  },
  {
    path: "/daily-menu/setup",
    items: [
      { label: "Inicio", path: "/dashboard" },
      { label: "Menú del Día", path: "/daily-menu" },
      { label: "Configuración" },
    ],
  },
  {
    path: "/daily-menu/history",
    items: [
      { label: "Inicio", path: "/dashboard" },
      { label: "Menú del Día", path: "/daily-menu" },
      { label: "Historial" },
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

  // Menu (Commercial)
  {
    path: "/menu",
    items: [{ label: "Inicio", path: "/dashboard" }, { label: "Catálogo" }],
  },
  {
    path: "/menu/list",
    items: [
      { label: "Inicio", path: "/dashboard" },
      { label: "Catálogo", path: "/menu" },
      { label: "Lista de Productos" },
    ],
  },
  {
    path: "/menu/items/new",
    items: [
      { label: "Inicio", path: "/dashboard" },
      { label: "Catálogo", path: "/menu" },
      { label: "Nuevo producto" },
    ],
  },
  {
    path: "/menu/categories/new",
    items: [
      { label: "Inicio", path: "/dashboard" },
      { label: "Catálogo", path: "/menu" },
      { label: "Nueva categoría" },
    ],
  },

  // Users
  {
    path: "/users",
    items: [{ label: "Inicio", path: "/dashboard" }, { label: "Equipo" }],
  },
  {
    path: "/users/list",
    items: [
      { label: "Inicio", path: "/dashboard" },
      { label: "Equipo", path: "/users" },
      { label: "Lista de Personal" },
    ],
  },
  {
    path: "/users/new",
    items: [
      { label: "Inicio", path: "/dashboard" },
      { label: "Equipo", path: "/users" },
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

  // Dynamic routes logic
  const segments = normalized.split("/").filter(Boolean);

  if (segments[0] === "tables" && segments.length >= 2) {
    const id = segments[1];
    if (id === "map" || id === "new") return BREADCRUMB_MAP.find(b => b.path === `/tables/${id}`)?.items || [];
    return [
      { label: "Inicio", path: "/dashboard" },
      { label: "Mesas", path: "/tables" },
      { label: `Mesa ${id}` },
    ];
  }

  if (segments[0] === "inventory" && segments.length >= 2) {
    const sub = segments[1];
    return BREADCRUMB_MAP.find(b => b.path === `/inventory/${sub}`)?.items || [];
  }

  if (segments[0] === "daily-menu" && segments.length >= 2) {
    const sub = segments[1];
    return BREADCRUMB_MAP.find(b => b.path === `/daily-menu/${sub}`)?.items || [];
  }

  if (segments[0] === "orders" && segments.length >= 2) {
    const id = segments[1];
    const base = [
      { label: "Inicio", path: "/dashboard" },
      { label: "Pedidos", path: "/orders" },
    ];
    if (id === "new") return [...base, { label: "Nuevo pedido" }];
    if (segments[2] === "edit") return [...base, { label: `Pedido #${id.slice(-6).toUpperCase()}` }, { label: "Editar" }];
    return [...base, { label: `Pedido #${id.slice(-6).toUpperCase()}` }];
  }

  if (segments[0] === "menu") {
    if (segments[1] === "list") return BREADCRUMB_MAP.find(b => b.path === "/menu/list")?.items || [];
    if (segments[1] === "items" && segments[2] === "new") return BREADCRUMB_MAP.find(b => b.path === "/menu/items/new")?.items || [];
    if (segments[1] === "categories" && segments[2] === "new") return BREADCRUMB_MAP.find(b => b.path === "/menu/categories/new")?.items || [];
    
    const base = [{ label: "Inicio", path: "/dashboard" }, { label: "Catálogo", path: "/menu" }];
    if (segments[1] === "items" && segments[3] === "edit") {
      return [...base, { label: "Lista de Productos", path: "/menu/list" }, { label: "Editar producto" }];
    }
    if (segments[1] === "categories" && segments[3] === "edit") {
      return [...base, { label: "Lista de Productos", path: "/menu/list" }, { label: "Editar categoría" }];
    }
    return base;
  }

  if (segments[0] === "users" && segments.length >= 2) {
    const id = segments[1];
    if (id === "list" || id === "new") return BREADCRUMB_MAP.find(b => b.path === `/users/${id}`)?.items || [];
    const base = [{ label: "Inicio", path: "/dashboard" }, { label: "Equipo", path: "/users" }];
    if (segments[2] === "edit") return [...base, { label: "Editar usuario" }];
    return base;
  }

  // Fallback: single item
  return [{ label: "Inicio", path: "/dashboard" }];
}