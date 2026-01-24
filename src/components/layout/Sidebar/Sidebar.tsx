import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  Home, 
  LayoutGrid, 
  ShoppingCart, 
  Package,
  Users,
  ChefHat,
  Menu,
  Utensils,
  Package2
} from "lucide-react";
import { cn } from "@/utils/cn";
import { ROUTES } from "@/app/routes";


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
 */
export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar-collapsed');
      return saved !== null ? JSON.parse(saved) : false;
    }
    return false;
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar-expanded-items');
      return saved !== null ? new Set(JSON.parse(saved)) : new Set();
    }
    return new Set();
  });
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Responsive behavior
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(false);
        setIsMobileOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Show all items for now
  const visibleNavItems = navigationItems;

  // Toggle functions
  const toggleCollapse = () => {
    if (!isMobile) {
      const newCollapsed = !isCollapsed;
      setIsCollapsed(newCollapsed);
      localStorage.setItem('sidebar-collapsed', JSON.stringify(newCollapsed));
    }
  };

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const toggleExpanded = (itemPath: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemPath)) {
      newExpanded.delete(itemPath);
    } else {
      newExpanded.add(itemPath);
    }
    setExpandedItems(newExpanded);
    // Save to localStorage
    localStorage.setItem('sidebar-expanded-items', JSON.stringify([...newExpanded]));
  };

  const handleNavClick = () => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path || 
           (path.includes(":") && location.pathname.startsWith(path.split(":")[0]));
  };

  // Mobile body lock
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 bg-sage-900/10 z-40 lg:hidden transition-opacity duration-200"
          onClick={toggleMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
          data-sidebar
          className={cn(
            // Base styles - clean without shadow/backdrop
            "fixed left-0 top-0 z-30 h-screen bg-white border-r border-sage-border-subtle",
            // Transitions
            "transition-all duration-300 ease-out",
            // Desktop collapsed state
            isCollapsed && !isMobile && "w-16",
            !isCollapsed && !isMobile && "w-72",
            // Mobile states
            isMobile && "w-72 -translate-x-full",
            isMobile && isMobileOpen && "translate-x-0"
          )}
        >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sage-border-subtle bg-white">
          {/* Logo */}
          <Link 
            to={ROUTES.DASHBOARD} 
            className="flex items-center gap-3 overflow-hidden group"
            onClick={handleNavClick}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-sage-500 to-sage-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
              <Home className="w-4 h-4 text-white" />
            </div>
            {(!isCollapsed || isMobile) && (
              <span className="text-xl font-bold bg-gradient-to-r from-sage-600 to-sage-700 bg-clip-text text-transparent truncate">
                Plaet
              </span>
            )}
          </Link>

          {/* Toggle Buttons */}
          <div className="flex items-center gap-2">
            {/* Desktop collapse toggle */}
            {!isMobile && (
              <button
                onClick={toggleCollapse}
                className={cn(
                  "p-2 rounded-xl hover:bg-sage-50 transition-all duration-200",
                  "text-sage-text-secondary hover:text-sage-600",
                  isCollapsed && "rotate-180"
                )}
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            
            {/* Mobile close toggle */}
            {isMobile && (
              <button
                onClick={toggleMobile}
                className="p-2 rounded-xl hover:bg-sage-50 transition-all duration-200 text-sage-text-secondary hover:text-sage-600"
                aria-label="Close sidebar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {visibleNavItems.map((navItem) => {
            const Icon = navItem.icon;
            const isItemActive = isActive(navItem.path);
            const isExpanded = expandedItems.has(navItem.path);
            const hasBadge = 'badge' in navItem && navItem.badge;
            
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
                  className={cn(
                    // Base styles
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                    // Text
                    "text-sm font-medium",
                    // Active state
                    isItemActive
                      ? "bg-sage-100 text-sage-700 shadow-sm border border-sage-200/50"
                      : "text-sage-text-primary hover:bg-sage-50 hover:text-sage-text-primary",
                    // Collapsed state
                    isCollapsed && !isMobile && "justify-center px-2"
                  )}
                >
                  {/* Icon */}
                  <Icon className={cn(
                    "flex-shrink-0 transition-colors",
                    isItemActive ? "text-sage-600" : "text-sage-text-secondary",
                    isCollapsed && !isMobile ? "w-5 h-5" : "w-4 h-4"
                  )} />
                  
                  {/* Badge */}
                  {hasBadge && (!isCollapsed || isMobile) && (
                    <span className="ml-auto text-xs px-1.5 py-0.5 bg-sage-100 text-sage-700 rounded-full font-semibold">
                      {navItem.badge as string}
                    </span>
                  )}
                  
                  {/* Text - hide when collapsed */}
                  {(!isCollapsed || isMobile) && (
                    <span className="truncate">{navItem.name}</span>
                  )}
                  
                  {/* Expand indicator for items with children */}
                  {navItem.children && (!isCollapsed || isMobile) && (
                    <svg 
                      className={cn(
                        "ml-auto w-4 h-4 transition-transform duration-200",
                        isExpanded && "rotate-90"
                      )} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </button>

                {/* Children - shown when expanded */}
                {navItem.children && isExpanded && (!isCollapsed || isMobile) && (
                  <div className="mt-1 space-y-1 ml-2">
                    {navItem.children.map((child) => {
                      const ChildIcon = child.icon;
                      const isChildActive = isActive(child.path);
                      const childHasBadge = 'badge' in child && child.badge;
                      
                      return (
                        <Link
                          key={child.path}
                          to={child.path}
                          onClick={handleNavClick}
                          className={cn(
                            // Base styles
                            "flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200",
                            // Text
                            "text-sm font-medium",
                            // Active state
                            isChildActive
                              ? "bg-sage-50 text-sage-600 border-l-2 border-sage-400"
                              : "text-sage-text-secondary hover:bg-sage-50 hover:text-sage-text-primary"
                          )}
                        >
                          <ChildIcon className={cn(
                            "w-4 h-4 flex-shrink-0 transition-colors",
                            isChildActive ? "text-sage-500" : "text-sage-text-muted"
                          )} />
                          
                          {childHasBadge && (
                            <span className="ml-auto text-xs px-1.5 py-0.5 bg-sage-100 text-sage-700 rounded-full">
                              {child.badge}
                            </span>
                          )}
                          
                          <span className="truncate">{child.name}</span>
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
        <div className="p-4 border-t border-sage-border-subtle">
          {(!isCollapsed || isMobile) && (
            <div className="text-xs text-sage-text-secondary text-center">
              <div>v2.0.0</div>
              <div className="text-sage-text-muted mt-0.5">© 2024 Plaet</div>
            </div>
          )}
          {isCollapsed && !isMobile && (
            <div className="text-xs text-sage-text-secondary text-center">
              <div>v2.0</div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Menu Button (visible when sidebar is closed) */}
      {isMobile && !isMobileOpen && (
        <button
          onClick={toggleMobile}
          className="fixed top-4 left-4 z-30 p-3 bg-white rounded-xl shadow-lg border border-sage-border-subtle text-sage-600 hover:bg-sage-50 hover:shadow-xl transition-all duration-200"
          aria-label="Open menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        )}
    </>
  );
}