import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks";
import {
  ArrowLeft,
  LogOut,
  User,
  Settings,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { ROUTES } from "@/app/routes";
import { getBreadcrumbs, type BreadcrumbItem } from "@/app/breadcrumbConfig";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export interface TopBarProps {
  /** Show back button and navigate to this route on click */
  backRoute?: string;
  /** Page title (overrides breadcrumb-derived title when provided) */
  title?: string;
  /** Optional subtitle below title */
  subtitle?: string;
  /** Breadcrumb items (default: derived from current pathname) */
  breadcrumbs?: BreadcrumbItem[];
  /** Custom action buttons (e.g. "Guardar", "Nueva mesa") */
  actions?: React.ReactNode;
  /** Hide the main title (useful when page has its own header) */
  hideTitle?: boolean;
}

/**
 * TopBar Component
 *
 * Unified top bar for all pages: back, title, breadcrumbs, actions, user menu.
 * Breadcrumbs are derived from route when not passed.
 */
export function TopBar({
  backRoute,
  title: titleProp,
  subtitle,
  breadcrumbs: breadcrumbsProp,
  actions,
  hideTitle = false,
}: TopBarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const user = auth?.user;
  const logout = auth?.logout || (() => {});
  
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Derive breadcrumbs from pathname when not provided
  const breadcrumbs =
    breadcrumbsProp ?? getBreadcrumbs(location.pathname);
  const title =
    titleProp ?? (breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].label : "Inicio");

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
    <header
      className={cn(
        "sticky top-0 z-20",
        "min-h-[64px] py-3 px-4 sm:px-6",
        "bg-white/90 backdrop-blur-xl",
        "border-b border-sage-200/50",
        "flex items-center justify-between gap-4"
      )}
    >
      {/* Left: Back + Title + Breadcrumbs */}
      <div className={cn(
        "flex items-center gap-3 min-w-0 flex-1",
        // Add left padding on mobile when no back button to avoid hamburger menu overlap
        !backRoute && "pl-14 lg:pl-0"
      )}>
        {backRoute && (
          <button
            type="button"
            onClick={handleBack}
            className={cn(
              "flex-shrink-0 p-2 -ml-2",
              "hover:bg-sage-100 active:bg-sage-200",
              "rounded-lg transition-colors duration-200",
              "min-w-[44px] min-h-[44px] flex items-center justify-center"
            )}
            aria-label="Volver"
          >
            <ArrowLeft className="w-5 h-5 text-carbon-500" />
          </button>
        )}

        <div className="min-w-0 flex-1">
          <div className={cn(
            "flex flex-col",
            hideTitle ? "justify-center min-h-[40px]" : "gap-0.5"
          )}>
            {!hideTitle && (
              <h1 className="text-base sm:text-lg font-black text-carbon-900 truncate tracking-tight">
                {title}
              </h1>
            )}
            {breadcrumbs.length > 1 && <Breadcrumbs items={breadcrumbs} />}
            {!hideTitle && subtitle && (
              <p className="text-xs sm:text-sm text-carbon-400 truncate hidden sm:block font-medium">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Right: Actions + User Profile */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {actions}

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className={cn(
              "flex items-center gap-2 px-2 py-1.5",
              "rounded-lg transition-colors duration-200",
              "hover:bg-sage-100",
              "min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0",
              isUserMenuOpen && "bg-sage-100"
            )}
            aria-expanded={isUserMenuOpen}
            aria-haspopup="true"
            aria-label="Menú de usuario"
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                "bg-gradient-to-br from-sage-400 to-sage-600",
                "text-white text-xs font-semibold"
              )}
            >
              {userInitials}
            </div>
            <span className="hidden sm:block text-sm font-medium text-carbon-700 max-w-[120px] truncate">
              {userName}
            </span>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-carbon-400 transition-transform duration-200 flex-shrink-0",
                isUserMenuOpen && "rotate-180"
              )}
            />
          </button>

          {isUserMenuOpen && (
            <div
              role="menu"
              className={cn(
                "absolute top-full right-0 mt-1 w-56 py-1",
                "bg-white rounded-xl border border-sage-200 shadow-lg",
                "z-50"
              )}
            >
              <div className="px-3 py-2 border-b border-sage-100">
                <p className="text-sm font-medium text-carbon-800 truncate">
                  {userName}
                </p>
                <p className="text-xs text-carbon-400 truncate">
                  {user?.email || "usuario@plaet.com"}
                </p>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    navigate(ROUTES.PROFILE);
                  }}
                  className={cn(
                    "w-full px-3 py-2 text-left flex items-center gap-2.5",
                    "text-sm text-carbon-600 hover:bg-sage-50 transition-colors"
                  )}
                >
                  <User className="w-4 h-4" />
                  Mi Perfil
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => setIsUserMenuOpen(false)}
                  className={cn(
                    "w-full px-3 py-2 text-left flex items-center gap-2.5",
                    "text-sm text-carbon-600 hover:bg-sage-50 transition-colors"
                  )}
                >
                  <Settings className="w-4 h-4" />
                  Configuración
                </button>
              </div>

              <div className="border-t border-sage-100 pt-1">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    logout();
                  }}
                  className={cn(
                    "w-full px-3 py-2 text-left flex items-center gap-2.5",
                    "text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                  )}
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
