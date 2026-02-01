import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut, User, Settings, ChevronDown } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar/Sidebar";
import { useSidebar } from "@/contexts/SidebarContext";
import { useAuth } from "@/hooks";
import { cn } from "@/utils/cn";
import { ROUTES } from "@/app/routes";

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
 * Full-screen layout with collapsible sidebar and user profile.
 * Modern 2025 UX/UI with consistent header across all pages.
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
}: SidebarLayoutProps) {
  const navigate = useNavigate();
  const { isCollapsed, isMobile } = useSidebar();
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBack = () => {
    if (backRoute) {
      navigate(backRoute);
    } else {
      navigate(-1);
    }
  };

  const userInitials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
      : "U";

  const userName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : "Usuario";

  return (
    <div className="min-h-screen bg-sage-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        className={cn(
          "min-h-screen flex flex-col",
          "transition-all duration-300 ease-out",
          !isMobile && (isCollapsed ? "lg:ml-16" : "lg:ml-72")
        )}
        id="main-content"
      >
        {/* Header - Always visible with user profile */}
        {!hideHeader && (
          <header
            className={cn(
              "sticky top-0 z-10",
              "h-14",
              "bg-white/90 backdrop-blur-xl",
              "border-b border-sage-200/50",
              "px-4 sm:px-6"
            )}
          >
            <div className="h-full flex items-center justify-between">
              {/* Left: Back + Title */}
              <div className="flex items-center gap-3">
                {backRoute && (
                  <button
                    onClick={handleBack}
                    className={cn(
                      "p-2 -ml-2",
                      "hover:bg-sage-100 active:bg-sage-200",
                      "rounded-lg transition-colors duration-200"
                    )}
                    aria-label="Volver"
                  >
                    <ArrowLeft className="w-5 h-5 text-carbon-500" />
                  </button>
                )}

                {title && (
                  <div className="min-w-0">
                    <h1 className="text-base sm:text-lg font-semibold text-carbon-900 truncate">
                      {title}
                    </h1>
                    {subtitle && (
                      <p className="text-xs text-carbon-400 truncate hidden sm:block">
                        {subtitle}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Right: Actions + User Profile */}
              <div className="flex items-center gap-3">
                {actions}

                {/* User Profile Dropdown */}
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className={cn(
                      "flex items-center gap-2 px-2 py-1.5",
                      "rounded-lg transition-colors duration-200",
                      "hover:bg-sage-100",
                      isUserMenuOpen && "bg-sage-100"
                    )}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full",
                        "bg-gradient-to-br from-sage-400 to-sage-600",
                        "flex items-center justify-center",
                        "text-white text-xs font-semibold"
                      )}
                    >
                      {userInitials}
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-carbon-700 max-w-[100px] truncate">
                      {userName}
                    </span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 text-carbon-400 transition-transform duration-200",
                        isUserMenuOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {/* Dropdown */}
                  {isUserMenuOpen && (
                    <div
                      className={cn(
                        "absolute top-full right-0 mt-1",
                        "w-52 py-1",
                        "bg-white rounded-xl",
                        "border border-sage-200 shadow-lg",
                        "z-50"
                      )}
                    >
                      <div className="px-3 py-2 border-b border-sage-100">
                        <p className="text-sm font-medium text-carbon-800 truncate">
                          {userName}
                        </p>
                        <p className="text-xs text-carbon-400 truncate">
                          {user?.email}
                        </p>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            navigate(ROUTES.PROFILE);
                          }}
                          className="w-full px-3 py-2 text-left flex items-center gap-2 text-sm text-carbon-600 hover:bg-sage-50"
                        >
                          <User className="w-4 h-4" />
                          Mi Perfil
                        </button>
                        <button
                          className="w-full px-3 py-2 text-left flex items-center gap-2 text-sm text-carbon-600 hover:bg-sage-50"
                        >
                          <Settings className="w-4 h-4" />
                          Configuración
                        </button>
                      </div>

                      <div className="border-t border-sage-100 pt-1">
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            logout();
                          }}
                          className="w-full px-3 py-2 text-left flex items-center gap-2 text-sm text-rose-600 hover:bg-rose-50"
                        >
                          <LogOut className="w-4 h-4" />
                          Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>
        )}

        {/* Content Area */}
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
