import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar/Sidebar";
import { useSidebar } from "@/contexts/SidebarContext";
import { cn } from "@/utils/cn";

/**
 * SidebarLayout Props
 */
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
}

/**
 * SidebarLayout Component
 *
 * Full-screen layout with collapsible sidebar.
 * Dynamically adjusts content area based on sidebar state.
 *
 * Design: Modern 2025 UX/UI
 * - Fluid responsive design
 * - Smooth transitions
 * - Full-width content by default
 * - Consistent across all pages
 *
 * @example
 * ```tsx
 * <SidebarLayout
 *   title="Nueva Mesa"
 *   subtitle="Configura los detalles"
 *   backRoute="/tables"
 * >
 *   <TableCreateForm />
 * </SidebarLayout>
 * ```
 */
export function SidebarLayout({
  children,
  backRoute,
  title,
  subtitle,
  actions,
  contentClassName,
  fullWidth = true,
  hideHeader = false,
}: SidebarLayoutProps) {
  const navigate = useNavigate();
  const { isCollapsed, isMobile } = useSidebar();

  const handleBack = () => {
    if (backRoute) {
      navigate(backRoute);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-sage-50/50">
      {/* Sidebar - Collapsible, managed by context */}
      <Sidebar />

      {/* Main Content Area - Dynamically adjusts to sidebar state */}
      <div
        className={cn(
          "min-h-screen flex flex-col",
          "transition-all duration-300 ease-out",
          // Dynamic margin based on sidebar state
          !isMobile && (isCollapsed ? "lg:ml-16" : "lg:ml-72")
        )}
        id="main-content"
      >
        {/* Header - Minimal, modern style */}
        {!hideHeader && (title || subtitle || backRoute || actions) && (
          <header
            className={cn(
              "sticky top-0 z-10",
              "bg-white/80 backdrop-blur-xl",
              "border-b border-sage-200/40",
              "px-4 sm:px-6 lg:px-8"
            )}
          >
            <div
              className={cn(
                "h-16 flex items-center justify-between",
                "max-w-7xl mx-auto w-full"
              )}
            >
              {/* Left: Back + Title */}
              <div className="flex items-center gap-3">
                {/* Back Button - Touch-friendly (48px) */}
                {backRoute && (
                  <button
                    onClick={handleBack}
                    className={cn(
                      "p-2.5 -ml-2",
                      "hover:bg-sage-100 active:bg-sage-200",
                      "rounded-xl transition-colors duration-200",
                      "min-w-[44px] min-h-[44px]",
                      "flex items-center justify-center"
                    )}
                    aria-label="Volver"
                  >
                    <ArrowLeft className="w-5 h-5 text-carbon-500" />
                  </button>
                )}

                {/* Title Section */}
                <div className="min-w-0">
                  {title && (
                    <h1 className="text-lg sm:text-xl font-semibold text-carbon-900 tracking-tight truncate">
                      {title}
                    </h1>
                  )}
                  {subtitle && (
                    <p className="text-sm text-carbon-400 font-light truncate hidden sm:block">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>

              {/* Right: Actions */}
              {actions && (
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  {actions}
                </div>
              )}
            </div>
          </header>
        )}

        {/* Content Area - Full width, fluid */}
        <main
          className={cn(
            "flex-1 w-full",
            !fullWidth && "max-w-7xl mx-auto",
            contentClassName
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
