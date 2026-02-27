import { Sidebar } from "@/components/layout/Sidebar/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { useSidebar } from "@/contexts/SidebarContext";
import { cn } from "@/utils/cn";

export interface SidebarLayoutProps {
  children: React.ReactNode;
  /** Route to navigate back to */
  backRoute?: string;
  /** Page title */
  title?: string;
  /** Page subtitle/description */
  subtitle?: string;
  /** Action buttons for header */
  actions?: React.ReactNode;
  /** Additional class names for content area */
  contentClassName?: string;
  /** Whether to use full width (no max-width constraint) */
  fullWidth?: boolean;
  /** Hide the header */
  hideHeader?: boolean;
  /** Hide the title inside TopBar */
  hideTitle?: boolean;
}

/**
 * SidebarLayout Component
 *
 * Full-screen layout with collapsible sidebar and unified TopBar.
 * TopBar includes back button, title, breadcrumbs, actions, user menu.
 */
export function SidebarLayout({
  children,
  backRoute,
  title,
  subtitle,
  actions,
  contentClassName,
  fullWidth = false,
  hideHeader = false,
  hideTitle = false,
}: SidebarLayoutProps) {
  const { isCollapsed, isMobile } = useSidebar();

  return (
    <div className="min-h-screen bg-sage-50">
      <Sidebar />

      <div
        className={cn(
          "min-h-screen flex flex-col",
          "transition-all duration-300 ease-out",
          !isMobile && (isCollapsed ? "lg:ml-16" : "lg:ml-72")
        )}
        id="main-content"
      >
        {!hideHeader && (
          <TopBar
            backRoute={backRoute}
            title={title}
            subtitle={subtitle}
            actions={actions}
            hideTitle={hideTitle}
          />
        )}

        <main
          className={cn(
            "flex-1",
            !fullWidth && "max-w-5xl mx-auto w-full px-4 sm:px-6 py-6",
            contentClassName
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
