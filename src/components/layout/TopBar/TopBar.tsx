import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks";
import { LogOut, User, Settings, ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";
import { ROUTES } from "@/app/routes";

/**
 * TopBar Component
 *
 * Minimal, modern top bar for dashboard pages.
 * Features user profile dropdown only - navigation handled by sidebar.
 */
export function TopBar() {
  const navigate = useNavigate();
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
        "h-14 px-4 sm:px-6 lg:px-8",
        "bg-white/80 backdrop-blur-xl",
        "border-b border-sage-200/40",
        "flex items-center justify-end"
      )}
    >
      {/* User Profile */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className={cn(
            "flex items-center gap-2 px-2 py-1.5",
            "rounded-lg transition-colors duration-200",
            "hover:bg-sage-100/80",
            isUserMenuOpen && "bg-sage-100"
          )}
        >
          {/* Avatar */}
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

          {/* Name - Hidden on mobile */}
          <span className="hidden sm:block text-sm font-medium text-carbon-700 max-w-[120px] truncate">
            {userName}
          </span>

          <ChevronDown
            className={cn(
              "w-4 h-4 text-carbon-400 transition-transform duration-200",
              isUserMenuOpen && "rotate-180"
            )}
          />
        </button>

        {/* Dropdown Menu */}
        {isUserMenuOpen && (
          <div
            className={cn(
              "absolute top-full right-0 mt-1",
              "w-56 py-1",
              "bg-white rounded-xl",
              "border border-sage-200/60 shadow-lg",
              "animate-in fade-in-0 zoom-in-95 duration-150"
            )}
          >
            {/* User Info */}
            <div className="px-3 py-2 border-b border-sage-100">
              <p className="text-sm font-medium text-carbon-800 truncate">
                {userName}
              </p>
              <p className="text-xs text-carbon-400 truncate">
                {user?.email || "usuario@plaet.com"}
              </p>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <button
                onClick={() => {
                  setIsUserMenuOpen(false);
                  navigate(ROUTES.PROFILE);
                }}
                className={cn(
                  "w-full px-3 py-2 text-left",
                  "flex items-center gap-2.5",
                  "text-sm text-carbon-600",
                  "hover:bg-sage-50 transition-colors"
                )}
              >
                <User className="w-4 h-4" />
                Mi Perfil
              </button>

              <button
                onClick={() => {
                  setIsUserMenuOpen(false);
                  // TODO: Navigate to settings
                }}
                className={cn(
                  "w-full px-3 py-2 text-left",
                  "flex items-center gap-2.5",
                  "text-sm text-carbon-600",
                  "hover:bg-sage-50 transition-colors"
                )}
              >
                <Settings className="w-4 h-4" />
                Configuración
              </button>
            </div>

            {/* Logout */}
            <div className="border-t border-sage-100 pt-1">
              <button
                onClick={() => {
                  setIsUserMenuOpen(false);
                  logout();
                }}
                className={cn(
                  "w-full px-3 py-2 text-left",
                  "flex items-center gap-2.5",
                  "text-sm text-rose-600",
                  "hover:bg-rose-50 transition-colors"
                )}
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
