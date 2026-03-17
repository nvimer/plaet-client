import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  PanelLeftClose,
  PanelLeft,
  X,
  Menu,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { ROUTES } from "@/app/routes";
import { useUIStore } from "@/stores/useUIStore";
import { usePermissions } from "@/hooks";
import { getNavigationItems } from "./navigationConfig";
import { SidebarItem } from "./components/SidebarItem";
import { SidebarGroup } from "./components/SidebarGroup";
import { BrandName } from "@/components";

/**
 * Sidebar Component - Premium Version 2.0
 * 
 * Professional restaurant management sidebar with:
 * - Click-to-expand accordion navigation
 * - Smart role-based menu filtering
 * - Collapsible state for maximum workspace
 * - Premium active indicators and hover effects
 * - Mobile-first responsive design
 */
export function Sidebar() {
  const isCollapsed = useUIStore((state) => state.isCollapsed);
  const isMobile = useUIStore((state) => state.isMobile);
  const toggleCollapsed = useUIStore((state) => state.toggleCollapsed);
  const closeMobile = useUIStore((state) => state.closeMobile);
  const toggleMobile = useUIStore((state) => state.toggleMobile);

  const location = useLocation();
  const { isSuperAdmin, permissions, getUserRoleNames } = usePermissions();

  // Load navigation items based on current context
  const navigationItems = useMemo(() => {
    const roles = getUserRoleNames;
    const primaryRole = roles[0] || 'USER';
    
    return getNavigationItems(primaryRole, isSuperAdmin(), permissions);
  }, [isSuperAdmin, permissions, getUserRoleNames]);

  const handleNavClick = () => {
    if (isMobile) {
      closeMobile();
    }
  };

  const isActive = (path: string) => {
    const basePath = path.split("?")[0];
    return location.pathname === basePath || 
           (basePath !== '/' && location.pathname.startsWith(basePath));
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out border-r border-sage-100 bg-white shadow-soft-xl overflow-y-auto overflow-x-hidden",
          isCollapsed ? "w-16" : "w-72",
          isMobile ? (isCollapsed ? "-translate-x-full" : "w-72 translate-x-0") : "translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* 1. Brand Section */}
          <div className={cn(
            "flex items-center h-20 px-4 mb-4 shrink-0 transition-all duration-300",
            isCollapsed ? "justify-center" : "justify-between"
          )}>
            {!isCollapsed && (
              <Link to={ROUTES.DASHBOARD} className="flex items-center gap-3 active:scale-95 transition-transform">
                <div className="w-10 h-10 rounded-xl bg-gradient-sage flex items-center justify-center shadow-soft-md">
                  <span className="text-white font-black text-xl">P</span>
                </div>
                <BrandName size="lg" className="tracking-tight" />
              </Link>
            )}
            
            {/* Desktop Toggle Button */}
            {!isMobile && (
              <button
                onClick={toggleCollapsed}
                className={cn(
                  "p-2 rounded-xl text-carbon-400 hover:bg-sage-50 hover:text-sage-600 transition-all",
                  isCollapsed && "mx-auto"
                )}
              >
                {isCollapsed ? <PanelLeft className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
              </button>
            )}

            {/* Mobile Close Button */}
            {isMobile && !isCollapsed && (
              <button onClick={closeMobile} className="p-2 text-carbon-400">
                <X className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* 2. Navigation Area */}
          <nav className="flex-1 space-y-1.5 px-2 py-4">
            {navigationItems.map((item) => (
              item.children && item.children.length > 0 ? (
                <SidebarGroup 
                  key={item.id} 
                  item={item} 
                  isCollapsed={isCollapsed} 
                  isMobile={isMobile}
                  onChildClick={handleNavClick}
                />
              ) : (
                <SidebarItem
                  key={item.id}
                  icon={item.icon}
                  name={item.name}
                  path={item.path}
                  active={isActive(item.path)}
                  isCollapsed={isCollapsed}
                  onClick={handleNavClick}
                />
              )
            ))}
          </nav>

          {/* 3. Footer / Help Section */}
          {!isCollapsed && (
            <div className="p-4 mt-auto">
              <div className="bg-sage-50/50 rounded-2xl p-4 border border-sage-100">
                <p className="text-[10px] font-black text-sage-600 uppercase tracking-widest mb-1">
                  Plan Activo
                </p>
                <p className="text-sm font-bold text-carbon-900 mb-3">Plaet Enterprise</p>
                <div className="w-full h-1.5 bg-sage-100 rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-sage-500 rounded-full" />
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Floating Action Button (FAB) */}
      {isMobile && (
        <button
          onClick={toggleMobile}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-carbon-900 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-90"
        >
          <Menu className="w-7 h-7" />
        </button>
      )}
    </>
  );
}
