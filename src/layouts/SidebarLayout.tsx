import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar/Sidebar";
import { Button } from "@/components";
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
}

/**
 * SidebarLayout Component
 *
 * Full-screen layout with collapsible sidebar.
 * Combines the benefits of full-screen space with navigation accessibility.
 *
 * Design: Sage Japanese (Wabi-Sabi)
 * - Ma (間): Generous whitespace
 * - Kanso (簡素): Simplicity
 * - Shizen (自然): Natural colors
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
  fullWidth = false,
}: SidebarLayoutProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backRoute) {
      navigate(backRoute);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-sage-50">
      {/* Sidebar - Collapsible */}
      <Sidebar />

      {/* Main Content Area - Adjusts to sidebar */}
      <div
        className={cn(
          "min-h-screen flex flex-col",
          "transition-all duration-300 ease-out",
          // Margin left for sidebar (matches Sidebar collapsed/expanded widths)
          "lg:ml-72", // When sidebar is expanded
          // The sidebar handles its own collapsed state
        )}
        id="main-content"
      >
        {/* Header - Minimal, Zen style */}
        <header
          className={cn(
            "sticky top-0 z-10",
            "bg-white/80 backdrop-blur-md",
            "border-b border-sage-200/50",
            "px-6 py-4 lg:px-8"
          )}
        >
          <div className="flex items-center justify-between">
            {/* Left: Back + Title */}
            <div className="flex items-center gap-4">
              {/* Back Button - Touch-friendly (48px) */}
              <Button
                variant="ghost"
                size="lg"
                onClick={handleBack}
                className={cn(
                  "p-3 -ml-2",
                  "hover:bg-sage-100 active:bg-sage-200",
                  "rounded-xl",
                  "min-w-[48px] min-h-[48px]" // Touch target
                )}
                aria-label="Volver"
              >
                <ArrowLeft className="w-5 h-5 text-sage-600" />
              </Button>

              {/* Title Section */}
              <div className="space-y-0.5">
                {title && (
                  <h1 className="text-xl lg:text-2xl font-semibold text-carbon-900 tracking-tight">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-sm text-carbon-500 font-light">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Right: Actions */}
            {actions && (
              <div className="flex items-center gap-3">{actions}</div>
            )}
          </div>
        </header>

        {/* Content Area - Full height, generous padding */}
        <main
          className={cn(
            "flex-1",
            "p-6 lg:p-8",
            // Sage Japanese: generous whitespace (Ma)
            !fullWidth && "max-w-6xl mx-auto w-full",
            contentClassName
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
