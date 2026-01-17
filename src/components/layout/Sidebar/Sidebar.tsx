import { Link, useLocation } from "react-router-dom";
import { Utensils } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import { getFilteredNavigationItems } from "@/config/navigation";
import { useMemo } from "react";

/**
 * Sidebar Component
 *
 * Dynamic sidebar that shows navigation items based on user roles.
 * Uses centralized navigation configuration for maintainability.
 */
export function Sidebar() {
    const location = useLocation();
    const { getUserRoleNames, user } = usePermissions();

    // Get user roles and filter navigation items
    const visibleNavItems = useMemo(() => {
        const userRoles = getUserRoleNames();
        return getFilteredNavigationItems(userRoles);
    }, [user, getUserRoleNames]);

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-sage-border-subtle">
            {/* Logo Section */}
            <div className="h-20 flex items-center px-6 border-b border-sage-border-subtle">
                <Link to="/dashboard" className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sage-green-100 rounded-xl flex items-center justify-center">
                        <Utensils className="w-6 h-6 text-sage-green-600" />
                    </div>
                    <span className="text-xl font-bold text-carbon-900">Plates</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-2">
                {visibleNavItems.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-carbon-500">
                        No hay opciones disponibles
                    </div>
                ) : (
                    visibleNavItems.map((item) => {
                        const Icon = item.icon;
                        // Check if current path matches the item path
                        // Handle dynamic routes like /orders/:id
                        const isActive =
                            location.pathname === item.path ||
                            (item.path.includes(":") &&
                                location.pathname.startsWith(
                                    item.path.split(":")[0]
                                ));

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                title={item.description}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                                    isActive
                                        ? "bg-sage-green-50 text-sage-green-700 shadow-soft-sm"
                                        : "text-sage-green-700 hover:bg-sage-50"
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })
                )}
            </nav>
        </aside>
    );
}
