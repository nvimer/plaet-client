import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  LayoutGrid,
  ShoppingCart,
  Package,
  Users,
  ChefHat,
  Menu,
  Utensils,
  Package2,
  PanelLeftClose,
  PanelLeft,
  X,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { ROUTES } from "@/app/routes";
import { useSidebar } from "@/contexts/SidebarContext";

// Modern navigation configuration - cleaner and more intuitive
const navigationItems = [
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
    path: ROUTES.MENU,
    name: "Menú",
    icon: Menu,
    description: "Catálogo de productos",
    children: [
      {
        path: ROUTES.MENU_ITEM_CREATE,
        name: "Nuevo Plato",
        icon: Utensils,
      },
      {
        path: ROUTES.MENU_CATEGORY_CREATE,
        name: "Nueva Categoría",
        icon: Package,
      },
      {
        path: ROUTES.STOCK_MANAGEMENT,
        name: "Inventario",
        icon: Package2,
        badge: "⚡",
      },
    ],
  },
  {
    path: ROUTES.ORDERS,
    name: "Pedidos",
    icon: ShoppingCart,
    description: "Gestionar pedidos",
    children: [
      {
        path: ROUTES.KITCHEN,
        name: "Cocina",
        icon: ChefHat,
      },
      {
        path: ROUTES.ORDER_CREATE,
        name: "Nuevo Pedido",
        icon: ShoppingCart,
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

/**
 * Sidebar Component
 *
 * Mobile-first, minimalist, modern sidebar with best practices:
 * - Smooth animations and micro-interactions
 * - Collapsible for desktop
 * - Drawer for mobile
 * - Clean, accessible design
 * - Progressive disclosure for nested items
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

  const handleNavClick = () => {
    if (isMobile) {
      closeMobile();
    }
  };

  const isActive = (path: string) => {
    return (
      location.pathname === path ||
      (path.includes(":") && location.pathname.startsWith(path.split(":")[0]))
    );
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
          // Base styles - modern glass effect
          "fixed left-0 top-0 z-50 h-screen",
          "bg-white/95 backdrop-blur-xl",
          "border-r border-sage-200/60",
          // Transitions
          "transition-all duration-300 ease-out",
          // Desktop collapsed state
          isCollapsed && !isMobile && "w-16",
          !isCollapsed && !isMobile && "w-72",
          // Mobile states
          isMobile && "w-72 -translate-x-full shadow-2xl",
          isMobile && isMobileOpen && "translate-x-0"
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "h-16 flex items-center border-b border-sage-200/60",
            isCollapsed && !isMobile ? "justify-center px-2" : "justify-between px-4"
          )}
        >
          {/* Logo */}
          <Link
            to={ROUTES.DASHBOARD}
            className="flex items-center gap-3 overflow-hidden group"
            onClick={handleNavClick}
          >
            <div
              className={cn(
                "bg-gradient-to-br from-sage-500 to-sage-600 rounded-xl",
                "flex items-center justify-center flex-shrink-0",
                "group-hover:scale-105 group-hover:shadow-lg",
                "transition-all duration-200",
                isCollapsed && !isMobile ? "w-10 h-10" : "w-9 h-9"
              )}
            >
              <Home
                className={cn(
                  "text-white",
                  isCollapsed && !isMobile ? "w-5 h-5" : "w-4 h-4"
                )}
              />
            </div>
            {(!isCollapsed || isMobile) && (
              <span className="text-xl font-bold bg-gradient-to-r from-sage-600 to-sage-700 bg-clip-text text-transparent truncate">
                Plaet
              </span>
            )}
          </Link>

          {/* Toggle Buttons */}
          {(!isCollapsed || isMobile) && (
            <div className="flex items-center">
              {/* Desktop collapse toggle */}
              {!isMobile && (
                <button
                  onClick={toggleCollapsed}
                  className={cn(
                    "p-2 rounded-xl transition-all duration-200",
                    "text-sage-400 hover:text-sage-600 hover:bg-sage-100"
                  )}
                  aria-label="Collapse sidebar"
                >
                  <PanelLeftClose className="w-5 h-5" />
                </button>
              )}

              {/* Mobile close toggle */}
              {isMobile && (
                <button
                  onClick={closeMobile}
                  className="p-2 rounded-xl hover:bg-sage-100 transition-all duration-200 text-sage-500 hover:text-sage-700"
                  aria-label="Close sidebar"
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
                "flex items-center justify-center"
              )}
              aria-label="Expand sidebar"
            >
              <PanelLeft className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav
          className={cn(
            "flex-1 overflow-y-auto py-4 space-y-1",
            isCollapsed && !isMobile ? "px-2" : "px-3"
          )}
        >
          {navigationItems.map((navItem) => {
            const Icon = navItem.icon;
            const isItemActive = isActive(navItem.path);
            const isExpanded = expandedItems.has(navItem.path);
            const hasBadge = "badge" in navItem && navItem.badge;

            return (
              <div key={navItem.path}>
                {/* Main item */}
                <button
                  onClick={() => {
                    if (navItem.children) {
                      toggleExpanded(navItem.path);
                    } else {
                      navigate(navItem.path);
                      handleNavClick();
                    }
                  }}
                  title={isCollapsed && !isMobile ? navItem.name : undefined}
                  className={cn(
                    // Base styles
                    "w-full flex items-center rounded-xl transition-all duration-200",
                    "text-sm font-medium",
                    // Padding based on collapsed state
                    isCollapsed && !isMobile
                      ? "justify-center p-3"
                      : "gap-3 px-3 py-2.5",
                    // Active state
                    isItemActive
                      ? "bg-sage-100 text-sage-700 shadow-sm"
                      : "text-carbon-600 hover:bg-sage-50 hover:text-carbon-800"
                  )}
                >
                  {/* Icon */}
                  <Icon
                    className={cn(
                      "flex-shrink-0 transition-colors",
                      isItemActive ? "text-sage-600" : "text-carbon-400",
                      isCollapsed && !isMobile ? "w-5 h-5" : "w-[18px] h-[18px]"
                    )}
                  />

                  {/* Text - hide when collapsed */}
                  {(!isCollapsed || isMobile) && (
                    <span className="truncate flex-1 text-left">
                      {navItem.name}
                    </span>
                  )}

                  {/* Badge */}
                  {hasBadge && (!isCollapsed || isMobile) && (
                    <span className="text-xs px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full font-medium">
                      {navItem.badge as string}
                    </span>
                  )}

                  {/* Expand indicator for items with children */}
                  {navItem.children && (!isCollapsed || isMobile) && (
                    <svg
                      className={cn(
                        "w-4 h-4 transition-transform duration-200 text-carbon-400",
                        isExpanded && "rotate-90"
                      )}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}
                </button>

                {/* Children - shown when expanded */}
                {navItem.children &&
                  isExpanded &&
                  (!isCollapsed || isMobile) && (
                    <div className="mt-1 ml-3 pl-3 border-l-2 border-sage-200/60 space-y-1">
                      {navItem.children.map((child) => {
                        const ChildIcon = child.icon;
                        const isChildActive = isActive(child.path);
                        const childHasBadge = "badge" in child && child.badge;

                        return (
                          <Link
                            key={child.path}
                            to={child.path}
                            onClick={handleNavClick}
                            className={cn(
                              // Base styles
                              "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                              "text-sm",
                              // Active state
                              isChildActive
                                ? "bg-sage-100/80 text-sage-700 font-medium"
                                : "text-carbon-500 hover:bg-sage-50 hover:text-carbon-700"
                            )}
                          >
                            <ChildIcon
                              className={cn(
                                "w-4 h-4 flex-shrink-0 transition-colors",
                                isChildActive
                                  ? "text-sage-500"
                                  : "text-carbon-400"
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
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          className={cn(
            "border-t border-sage-200/60",
            isCollapsed && !isMobile ? "p-2" : "p-4"
          )}
        >
          {(!isCollapsed || isMobile) && (
            <div className="text-xs text-carbon-400 text-center space-y-0.5">
              <div className="font-medium">Plaet v2.0</div>
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

      {/* Mobile Menu Button (visible when sidebar is closed) */}
      {isMobile && !isMobileOpen && (
        <button
          onClick={toggleMobile}
          className={cn(
            "fixed top-4 left-4 z-30",
            "p-3 bg-white/90 backdrop-blur-sm rounded-xl",
            "shadow-lg border border-sage-200/60",
            "text-sage-600 hover:bg-white hover:shadow-xl",
            "transition-all duration-200",
            "active:scale-95"
          )}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}
    </>
  );
}