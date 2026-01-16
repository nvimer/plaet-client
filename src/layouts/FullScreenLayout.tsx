import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components";

/**
 * FullScreenLayout Props
 */
export interface FullScreenLayoutProps {
  children: React.ReactNode;
  backRoute?: string;
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

/**
 * FullScreenLayout Component
 * 
 * Layout optimized for full-screen actions and workflows.
 * Provides a clear navigation header with back button and
 * full-screen content area.
 * 
 * Use this layout for:
 * - Creating new resources (orders, items, etc.)
 * - Editing existing resources
 * - Complex workflows that need full screen space
 * 
 * @example
 * ```tsx
 * <FullScreenLayout
 *   title="Nuevo Pedido"
 *   backRoute="/orders"
 * >
 *   <OrderCreateForm />
 * </FullScreenLayout>
 * ```
 */
export function FullScreenLayout({
  children,
  backRoute,
  title,
  subtitle,
  actions,
}: FullScreenLayoutProps) {
  const navigate = useNavigate();

  /**
   * Handles back navigation
   */
  const handleBack = () => {
    if (backRoute) {
      navigate(backRoute);
    } else {
      navigate(-1); // Go back to previous page
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Header with back button */}
      <header className="bg-white border-b border-sage-border-subtle px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="lg"
              onClick={handleBack}
              className="p-3 -ml-3"
              aria-label="Volver"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div>
              {title && (
                <h1 className="text-2xl font-semibold text-carbon-900">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-sm text-carbon-600 font-light mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </header>

      {/* Full-screen content */}
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
