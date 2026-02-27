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
import { BrandName } from "@/components";
import { useSidebar } from "@/contexts/SidebarContext";
import { usePermissions } from "@/hooks";
import { getNavigationItems } from "./navigationConfig";
import { SidebarItem } from "./components/SidebarItem";
import { SidebarGroup } from "./components/SidebarGroup";

/**
 * Sidebar Component - Premium Version 2.0
 * 
 * Professional restaurant management sidebar with:
 * - Smart accordions with Framer Motion animations
 * - Role-based navigation config
 * - Premium active indicators and hover effects
 * - Mobile-first responsive design
 */
export function Sidebar() {
  const {
    isCollapsed,
    isMobileOpen,
    isMobile,
    toggleCollapsed,
    closeMobile,
    toggleMobile,
  } = useSidebar();

  const location = useLocation();
  const { isSuperAdmin, user } = usePermissions();

  // Load navigation items based on current context
  const navigationItems = useMemo(() => {
    const roleName = user?.roles?.[0] || 'USER';
    const roleString = typeof roleName === 'object' ? roleName.name : roleName;
    return getNavigationItems(roleString, isSuperAdmin());
  }, [isSuperAdmin, user]);

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
      {/* Mobile Overlay */}
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 bg-carbon-900/40 backdrop-blur-sm z-40 lg:hidden transition-all duration-500"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        data-sidebar
        className={cn(
          "fixed left-0 top-0 z-50 h-screen",
          "bg-white border-r border-sage-200/60 shadow-smooth-xl",
          "transition-all duration-700 ease-[0.4,0,0.2,1]",
          isCollapsed && !isMobile ? "w-20" : "w-72",
          isMobile && "-translate-x-full shadow-2xl",
          isMobile && isMobileOpen && "translate-x-0",
        )}
      >
        {/* Header - Brand & Logo */}
        <div className={cn(
          "h-24 flex items-center border-b border-sage-100/50 px-6",
          isCollapsed && !isMobile ? "justify-center px-2" : "justify-between"
        )}>
          <Link
            to={ROUTES.DASHBOARD}
            className="flex items-center gap-3.5 overflow-hidden group"
            onClick={handleNavClick}
          >
            <div className={cn(
              "flex items-center justify-center flex-shrink-0 transition-all duration-700",
              "bg-gradient-to-tr from-white to-sage-50 rounded-2xl shadow-soft-md group-hover:shadow-soft-lg group-hover:scale-105",
              isCollapsed && !isMobile ? "w-12 h-12" : "w-11 h-11"
            )}>
              <img src="/plaet.png" alt="Plaet Logo" className="w-8 h-8 object-contain mix-blend-multiply" />
            </div>
            {(!isCollapsed || isMobile) && (
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-black tracking-tighter text-carbon-900 leading-none">Plaet</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-sage-500 mt-1" />
                </div>
                <span className="text-[10px] font-bold text-carbon-400 uppercase tracking-[0.3em] mt-1 leading-none">Management</span>
              </div>
            )}
          </Link>

          {(!isCollapsed || isMobile) && (
            <button
              onClick={isMobile ? closeMobile : toggleCollapsed}
              className="p-2 rounded-xl text-carbon-300 hover:text-carbon-900 hover:bg-sage-50 transition-all duration-300 active:scale-90"
            >
              {isMobile ? <X className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5 stroke-[1.5px]" />}
            </button>
          )}
        </div>

        {/* Navigation Area */}
        <div className="flex flex-col h-[calc(100vh-96px)]">
          <nav className={cn(
            "flex-1 py-6 custom-scrollbar",
            isCollapsed && !isMobile ? "overflow-y-visible" : "overflow-y-auto"
          )}>
            {/* Section Label (Optional - only when expanded) */}
            {(!isCollapsed || isMobile) && (
              <div className="px-8 mb-4">
                <span className="text-[10px] font-black text-carbon-300 uppercase tracking-[0.2em]">Navegación Principal</span>
              </div>
            )}

            <div className="space-y-1">
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
                  <div key={item.id} className={cn(!isCollapsed || isMobile ? "px-3" : "")}>
                    <SidebarItem
                      icon={item.icon}
                      name={item.name}
                      path={item.path}
                      isActive={isActive(item.path)}
                      isCollapsed={isCollapsed}
                      isMobile={isMobile}
                      badge={item.badge}
                      description={item.description}
                      onClick={handleNavClick}
                    />
                  </div>
                )
              ))}
            </div>
          </nav>

          {/* Footer - Collapse Toggle */}
          <div className={cn(
            "p-4 border-t border-sage-100 bg-sage-50/10",
            isCollapsed && !isMobile ? "flex flex-col items-center gap-4" : "flex items-center justify-between"
          )}>
            <button
              onClick={toggleCollapsed}
              className={cn(
                "flex items-center justify-center rounded-2xl bg-white shadow-soft-md text-sage-600 hover:bg-sage-600 hover:text-white transition-all",
                isCollapsed && !isMobile ? "w-12 h-12" : "w-10 h-10"
              )}
            >
              {isCollapsed ? <PanelLeft className="w-6 h-6" /> : <PanelLeftClose className="w-5 h-5" />}
            </button>
            
            {(!isCollapsed || isMobile) && (
              <span className="text-[10px] font-black text-carbon-300 uppercase tracking-widest">v2.1.0</span>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Floating Menu Button - visible only when sidebar is closed on mobile */}
      {isMobile && !isMobileOpen && (
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