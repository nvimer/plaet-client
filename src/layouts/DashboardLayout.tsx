import { ModernSidebar } from "@/components/layout/Sidebar/ModernSidebar";
import { TopBar } from "@/components/layout/TopBar";
import type { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <ModernSidebar />
      <div className="transition-all duration-300 ease-out lg:ml-72">
        <TopBar />
        <main className="p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
