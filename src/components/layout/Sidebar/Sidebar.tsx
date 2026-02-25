import { useState, useRef, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  LayoutGrid,
  ShoppingCart,
  Package,
  Users,
  ChefHat,
  Menu,
  Package2,
  PanelLeftClose,
  PanelLeft,
  X,
  Grid3x3,
  Plus,
  ChevronRight,
  BarChart3,
  Wallet,
  Receipt,
  Settings,
  Building2,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { ROUTES } from "@/app/routes";
import { BrandName } from "@/components";
import { useSidebar } from "@/contexts/SidebarContext";
import { useAuth, usePermissions } from "@/hooks";
import { RoleName } from "@/types";
import { useCategories } from "@/features/menu/categories/hooks";
import type { LucideIcon } from "lucide-react";

/** Simple link for nested lists (e.g. inside expandable) */
interface NavSubLink {
  path: string;
  name: string;
  icon: LucideIcon;
}

interface NavChildLink {
  type: "link";
  path: string;
  name: string;
  icon: LucideIcon;
  badge?: string;
}

interface NavChildDivider {
  type: "divider";
  path: string;
  name: string;
  icon: LucideIcon;
}

interface NavChildExpandable {
  type: "expandable";
  key: string;
  name: string;
  icon: LucideIcon;
  children: NavSubLink[];
}

type NavChild = NavChildLink | NavChildDivider | NavChildExpandable;

interface NavItem {
  path: string;
  name: string;
  icon: LucideIcon;
  description?: string;
  badge?: string;
  children?: NavChild[];
}

// Base navigation items (static)
const baseNavigationItems: NavItem[] = [
  {
    path: ROUTES.DASHBOARD,
    name: "Dashboard",
    icon: Home,
    description: "Vista general del sistema",
  },
  {
    path: ROUTES.TABLES,
    name: "Mesas",
    icon: LayoutGrid,
    description: "Gestionar mesas",
  },
  {
    path: ROUTES.ORDERS,
    name: "Pedidos",
    icon: ShoppingCart,
    description: "Gestionar pedidos",
    children: [
      {
        type: "link",
        path: ROUTES.ORDERS,
        name: "Todos los pedidos",
        icon: ShoppingCart,
      },
      { type: "link", path: ROUTES.KITCHEN, name: "Cocina", icon: ChefHat },
      {
        type: "link",
        path: ROUTES.ORDER_CREATE,
        name: "Nuevo Pedido",
        icon: Plus,
      },
    ],
  },
  {
    path: "/admin",
    name: "Administración",
    icon: Settings,
    description: "Contabilidad y reportes",
    children: [
      {
        type: "link",
        path: ROUTES.ADMIN_DASHBOARD,
        name: "Estadísticas",
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
        name: "Gastos",
        icon: Receipt,
      },
    ],
  },
  {
    path: ROUTES.USERS,
    name: "Usuarios",
    icon: Users,
    description: "Gestionar usuarios",
  },
];

// Direct menu navigation item
const menuNavItem: NavItem = {
  path: ROUTES.MENU,
  name: "Menú",
  icon: Menu,
  description: "Catálogo de productos",
};

/**
 * Sidebar Component
 *
 * Mobile-first, minimalist, modern sidebar with:
 * - Dynamic menu categories from API (max 5)
 * - Flyout submenu when collapsed
 * - Smooth animations and micro-interactions
 * - Uses global SidebarContext for state
 */
export function Sidebar() {
  const {
    isCollapsed,
    isMobileOpen,
    isMobile,
    expandedItems,
    toggleCollapsed,
    toggleMobile,
    closeMobile,
    toggleExpanded,
  } = useSidebar();

  const location = useLocation();
  const navigate = useNavigate();

  // Fetch categories for dynamic menu
  const { data: _categories } = useCategories();

  // Flyout state for collapsed sidebar
  const [flyoutItem, setFlyoutItem] = useState<string | null>(null);
  const flyoutRef = useRef<HTMLDivElement>(null);
  const flyoutTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Expanded state for nested items (e.g. "Categorías" inside Menú)
  const [expandedNested, setExpandedNested] = useState<Set<string>>(new Set());

  const toggleExpandedNested = (key: string) => {
    setExpandedNested((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const { isSuperAdmin, user } = usePermissions();

  // Build navigation items based on role
  const navigationItems = useMemo(() => {
    // 1. Logic for SUPERADMIN
    if (isSuperAdmin()) {
      return [
        {
          path: ROUTES.DASHBOARD,
          name: "Dashboard Global",
          icon: Home,
          description: "Métricas del SaaS",
        },
        {
          path: ROUTES.RESTAURANTS,
          name: "Restaurantes",
          icon: Building2,
          description: "Gestionar inquilinos",
        },
      ];
    }

    // 2. Logic for regular users (ADMIN, CASHIER, etc.)
    // Build Menu children
    const menuChildren: NavChild[] = [
      {
        type: "link",
        path: ROUTES.MENU,
        name: "Todos los productos",
        icon: Grid3x3,
      },
      {
        type: "link",
        path: ROUTES.STOCK_MANAGEMENT,
        name: "Inventario",
        icon: Package2,
        badge: "⚡",
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

    const items: NavItem[] = [
      baseNavigationItems[0], // Dashboard
      baseNavigationItems[1], // Tables
      {
        ...menuNavItem,
        children: menuChildren,
      },
      baseNavigationItems[2], // Orders
      baseNavigationItems[3], // Administration
      baseNavigationItems[4], // Users
    ];

    return items;
  }, [isSuperAdmin, user]);

  const handleNavClick = () => {
    if (isMobile) {
      closeMobile();
    }
    setFlyoutItem(null);
  };

  const isActive = (path: string) => {
    // Handle query params - match base path
    const basePath = path.split("?")[0];
    return (
      location.pathname === basePath ||
      (basePath.includes(":") &&
        location.pathname.startsWith(basePath.split(":")[0]))
    );
  };

  // Close flyout when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        flyoutRef.current &&
        !flyoutRef.current.contains(event.target as Node)
      ) {
        setFlyoutItem(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Flyout handlers
  const handleMouseEnterCollapsed = (
    itemPath: string,
    hasChildren: boolean,
  ) => {
    if (isCollapsed && !isMobile && hasChildren) {
      if (flyoutTimeoutRef.current) {
        clearTimeout(flyoutTimeoutRef.current);
      }
      setFlyoutItem(itemPath);
    }
  };

  const handleMouseLeaveCollapsed = () => {
    if (isCollapsed && !isMobile) {
      flyoutTimeoutRef.current = setTimeout(() => {
        setFlyoutItem(null);
      }, 150);
    }
  };

  const handleFlyoutMouseEnter = () => {
    if (flyoutTimeoutRef.current) {
      clearTimeout(flyoutTimeoutRef.current);
    }
  };

  const handleFlyoutMouseLeave = () => {
    flyoutTimeoutRef.current = setTimeout(() => {
      setFlyoutItem(null);
    }, 150);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 bg-carbon-900/20 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        data-sidebar
        className={cn(
          "fixed left-0 top-0 z-50 h-screen",
          "bg-white/95 backdrop-blur-xl",
          "border-r border-sage-200/60",
          "transition-all duration-300 ease-out",
          isCollapsed && !isMobile && "w-16",
          !isCollapsed && !isMobile && "w-72",
          isMobile && "w-72 -translate-x-full shadow-2xl",
          isMobile && isMobileOpen && "translate-x-0",
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "h-16 flex items-center border-b border-sage-200/60",
            isCollapsed && !isMobile
              ? "justify-center px-2"
              : "justify-between px-4",
          )}
        >
          <Link
            to={ROUTES.DASHBOARD}
            className="flex items-center gap-3 overflow-hidden group"
            onClick={handleNavClick}
          >
            <div
              className={cn(
                "flex items-center justify-center flex-shrink-0",
                "group-hover:scale-105",
                "transition-all duration-200",
                isCollapsed && !isMobile ? "w-10 h-10" : "w-9 h-9",
              )}
            >
              <img 
                src="/plaet.png" 
                alt="Plaet Logo" 
                className="w-full h-full object-contain mix-blend-multiply" 
              />
            </div>
            {(!isCollapsed || isMobile) && (
              <BrandName
                className="text-xl font-bold bg-gradient-to-r from-sage-600 to-sage-700 bg-clip-text text-transparent truncate tracking-tight"
                accentClassName="text-sage-700"
              />
            )}
          </Link>

          {(!isCollapsed || isMobile) && (
            <div className="flex items-center">
              {!isMobile && (
                <button
                  onClick={toggleCollapsed}
                  className={cn(
                    "p-2 rounded-xl transition-all duration-200",
                    "text-sage-400 hover:text-sage-600 hover:bg-sage-100",
                  )}
                  aria-label="Contraer barra lateral"
                >
                  <PanelLeftClose className="w-5 h-5" />
                </button>
              )}
              {isMobile && (
                <button
                  onClick={closeMobile}
                  className="p-2 rounded-xl hover:bg-sage-100 transition-all duration-200 text-sage-500 hover:text-sage-700"
                  aria-label="Cerrar barra lateral"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Expand button when collapsed */}
        {isCollapsed && !isMobile && (
          <div className="px-2 py-3 border-b border-sage-200/60">
            <button
              onClick={toggleCollapsed}
              className={cn(
                "w-full p-2 rounded-xl transition-all duration-200",
                "text-sage-400 hover:text-sage-600 hover:bg-sage-100",
                "flex items-center justify-center",
              )}
              aria-label="Expandir barra lateral"
            >
              <PanelLeft className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav
          className={cn(
            "flex-1 overflow-y-auto py-4 space-y-1",
            isCollapsed && !isMobile ? "px-2" : "px-3",
          )}
        >
          {navigationItems.map((navItem) => {
            const Icon = navItem.icon;
            const isItemActive = isActive(navItem.path);
            const isExpanded = expandedItems.has(navItem.path);
            const hasBadge = "badge" in navItem && navItem.badge;
            const hasChildren = navItem.children && navItem.children.length > 0;
            const isFlyoutOpen = flyoutItem === navItem.path;

            return (
              <div
                key={navItem.path}
                className="relative"
                onMouseEnter={() =>
                  handleMouseEnterCollapsed(navItem.path, !!hasChildren)
                }
                onMouseLeave={handleMouseLeaveCollapsed}
              >
                {/* Main item */}
                <button
                  onClick={() => {
                    if (hasChildren && !isCollapsed) {
                      toggleExpanded(navItem.path);
                    } else if (hasChildren && isCollapsed) {
                      // Toggle flyout on click when collapsed
                      setFlyoutItem(isFlyoutOpen ? null : navItem.path);
                    } else {
                      navigate(navItem.path);
                      handleNavClick();
                    }
                  }}
                  title={isCollapsed && !isMobile ? navItem.name : undefined}
                  className={cn(
                    "w-full flex items-center rounded-xl transition-all duration-200",
                    "text-sm font-medium",
                    isCollapsed && !isMobile
                      ? "justify-center p-3"
                      : "gap-3 px-3 py-2.5",
                    isItemActive
                      ? "bg-sage-100 text-sage-700 shadow-sm"
                      : "text-carbon-600 hover:bg-sage-50 hover:text-carbon-800",
                  )}
                >
                  <div className="relative">
                    <Icon
                      className={cn(
                        "flex-shrink-0 transition-colors",
                        isItemActive ? "text-sage-600" : "text-carbon-400",
                        isCollapsed && !isMobile
                          ? "w-5 h-5"
                          : "w-[18px] h-[18px]",
                      )}
                    />
                    {/* Submenu indicator dot when collapsed */}
                    {hasChildren && isCollapsed && !isMobile && (
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-sage-400 rounded-full" />
                    )}
                  </div>

                  {(!isCollapsed || isMobile) && (
                    <span className="truncate flex-1 text-left">
                      {navItem.name}
                    </span>
                  )}

                  {hasBadge && (!isCollapsed || isMobile) && (
                    <span className="text-xs px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full font-medium">
                      {navItem.badge as string}
                    </span>
                  )}

                  {hasChildren && (!isCollapsed || isMobile) && (
                    <ChevronRight
                      className={cn(
                        "w-4 h-4 transition-transform duration-200 text-carbon-400",
                        isExpanded && "rotate-90",
                      )}
                    />
                  )}
                </button>

                {/* Children - shown when expanded (not collapsed) */}
                {hasChildren && isExpanded && (!isCollapsed || isMobile) && (
                  <div className="mt-1 ml-3 pl-3 border-l-2 border-sage-200/60 space-y-1">
                    {navItem.children!.map((child, idx) => {
                      if (child.type === "divider") {
                        return (
                          <div
                            key={`divider-${idx}`}
                            className="my-2 border-t border-sage-200/60"
                          />
                        );
                      }

                      if (child.type === "expandable") {
                        const isNestedExpanded = expandedNested.has(child.key);
                        const ExpandIcon = child.icon;
                        return (
                          <div key={child.key}>
                            <button
                              type="button"
                              onClick={() => toggleExpandedNested(child.key)}
                              className={cn(
                                "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-left text-sm",
                                "text-carbon-500 hover:bg-sage-50 hover:text-carbon-700",
                              )}
                            >
                              <ExpandIcon className="w-4 h-4 flex-shrink-0 text-carbon-400" />
                              <span className="truncate flex-1">
                                {child.name}
                              </span>
                              <ChevronRight
                                className={cn(
                                  "w-4 h-4 text-carbon-400 transition-transform duration-200",
                                  isNestedExpanded && "rotate-90",
                                )}
                              />
                            </button>
                            {isNestedExpanded && child.children.length > 0 && (
                              <div className="ml-4 pl-2 border-l border-sage-200/60 space-y-0.5 mt-0.5">
                                {child.children.map((sub) => {
                                  const SubIcon = sub.icon;
                                  const isSubActive = isActive(sub.path);
                                  return (
                                    <Link
                                      key={sub.path}
                                      to={sub.path}
                                      onClick={handleNavClick}
                                      className={cn(
                                        "flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all duration-200 text-sm",
                                        isSubActive
                                          ? "bg-sage-100/80 text-sage-700 font-medium"
                                          : "text-carbon-500 hover:bg-sage-50 hover:text-carbon-700",
                                      )}
                                    >
                                      <SubIcon className="w-3.5 h-3.5 flex-shrink-0 text-carbon-400" />
                                      <span className="truncate">
                                        {sub.name}
                                      </span>
                                    </Link>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      }

                      const ChildIcon = child.icon;
                      const isChildActive = isActive(child.path);
                      const childHasBadge = child.badge;

                      return (
                        <Link
                          key={child.path}
                          to={child.path}
                          onClick={handleNavClick}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                            "text-sm",
                            isChildActive
                              ? "bg-sage-100/80 text-sage-700 font-medium"
                              : "text-carbon-500 hover:bg-sage-50 hover:text-carbon-700",
                          )}
                        >
                          <ChildIcon
                            className={cn(
                              "w-4 h-4 flex-shrink-0 transition-colors",
                              isChildActive
                                ? "text-sage-500"
                                : "text-carbon-400",
                            )}
                          />
                          <span className="truncate flex-1">{child.name}</span>
                          {childHasBadge && (
                            <span className="text-xs px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full font-medium">
                              {child.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}

                {/* Flyout for collapsed sidebar */}
                {hasChildren && isFlyoutOpen && isCollapsed && !isMobile && (
                  <div
                    ref={flyoutRef}
                    onMouseEnter={handleFlyoutMouseEnter}
                    onMouseLeave={handleFlyoutMouseLeave}
                    className={cn(
                      "absolute left-full top-0 ml-2 z-50",
                      "min-w-[200px] py-2 px-2",
                      "bg-white rounded-xl shadow-lg border border-sage-200",
                      "animate-in fade-in slide-in-from-left-2 duration-200",
                    )}
                  >
                    <div className="text-xs font-semibold text-carbon-400 uppercase tracking-wide px-3 py-2">
                      {navItem.name}
                    </div>
                    <div className="space-y-1">
                      {navItem.children!.map((child, idx) => {
                        if (child.type === "divider") {
                          return (
                            <div
                              key={`flyout-divider-${idx}`}
                              className="my-2 border-t border-sage-200/60 mx-2"
                            />
                          );
                        }

                        if (child.type === "expandable") {
                          const isNestedExpanded = expandedNested.has(
                            child.key,
                          );
                          const ExpandIcon = child.icon;
                          return (
                            <div key={child.key}>
                              <button
                                type="button"
                                onClick={() => toggleExpandedNested(child.key)}
                                className={cn(
                                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-left text-sm",
                                  "text-carbon-500 hover:bg-sage-50 hover:text-carbon-700",
                                )}
                              >
                                <ExpandIcon className="w-4 h-4 flex-shrink-0 text-carbon-400" />
                                <span className="truncate flex-1">
                                  {child.name}
                                </span>
                                <ChevronRight
                                  className={cn(
                                    "w-4 h-4 text-carbon-400 transition-transform duration-200",
                                    isNestedExpanded && "rotate-90",
                                  )}
                                />
                              </button>
                              {isNestedExpanded &&
                                child.children.length > 0 && (
                                  <div className="ml-2 pl-2 border-l border-sage-200/60 space-y-0.5">
                                    {child.children.map((sub) => {
                                      const SubIcon = sub.icon;
                                      const isSubActive = isActive(sub.path);
                                      return (
                                        <Link
                                          key={sub.path}
                                          to={sub.path}
                                          onClick={handleNavClick}
                                          className={cn(
                                            "flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all duration-200 text-sm",
                                            isSubActive
                                              ? "bg-sage-100/80 text-sage-700 font-medium"
                                              : "text-carbon-500 hover:bg-sage-50 hover:text-carbon-700",
                                          )}
                                        >
                                          <SubIcon className="w-3.5 h-3.5 flex-shrink-0 text-carbon-400" />
                                          <span className="truncate">
                                            {sub.name}
                                          </span>
                                        </Link>
                                      );
                                    })}
                                  </div>
                                )}
                            </div>
                          );
                        }

                        const ChildIcon = child.icon;
                        const isChildActive = isActive(child.path);
                        const childHasBadge = child.badge;

                        return (
                          <Link
                            key={child.path}
                            to={child.path}
                            onClick={handleNavClick}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                              "text-sm",
                              isChildActive
                                ? "bg-sage-100/80 text-sage-700 font-medium"
                                : "text-carbon-500 hover:bg-sage-50 hover:text-carbon-700",
                            )}
                          >
                            <ChildIcon
                              className={cn(
                                "w-4 h-4 flex-shrink-0",
                                isChildActive
                                  ? "text-sage-500"
                                  : "text-carbon-400",
                              )}
                            />
                            <span className="truncate flex-1">
                              {child.name}
                            </span>
                            {childHasBadge && (
                              <span className="text-xs px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full font-medium">
                                {child.badge}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          className={cn(
            "border-t border-sage-200/60",
            isCollapsed && !isMobile ? "p-2" : "p-4",
          )}
        >
          {(!isCollapsed || isMobile) && (
            <div className="text-xs text-carbon-400 text-center space-y-0.5">
              <div className="font-medium">
                <BrandName className="inline-flex tracking-tight" /> v2.0
              </div>
              <div className="text-carbon-300">© 2025</div>
            </div>
          )}
          {isCollapsed && !isMobile && (
            <div className="text-[10px] text-carbon-400 text-center font-medium">
              v2.0
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Menu Button */}
      {isMobile && !isMobileOpen && (
        <button
          onClick={toggleMobile}
          className={cn(
            "fixed top-4 left-4 z-30",
            "p-3 bg-white/90 backdrop-blur-sm rounded-xl",
            "shadow-lg border border-sage-200/60",
            "text-sage-600 hover:bg-white hover:shadow-xl",
            "transition-all duration-200",
            "active:scale-95",
          )}
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}
    </>
  );
}
