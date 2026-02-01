import { Sidebar } from "@/components/layout/Sidebar/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { useSidebar } from "@/contexts/SidebarContext";
import { cn } from "@/utils/cn";
import type { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

/**
 * DashboardLayout Component
 *
 * Main layout for dashboard pages with collapsible sidebar.
 * Dynamically adjusts content area based on sidebar state.
 */
export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isCollapsed, isMobile } = useSidebar();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-sage-50/50">
      <Sidebar />
      <div
        className={cn(
          "min-h-screen flex flex-col",
          "transition-all duration-300 ease-out",
          // Dynamic margin based on sidebar state
          !isMobile && (isCollapsed ? "lg:ml-16" : "lg:ml-72")
        )}
        id="main-content"
      >
        <TopBar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
