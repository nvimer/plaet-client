import { Link, useLocation } from "react-router-dom";
import {
    Home,
    LayoutGrid,
    MenuIcon,
    ShoppingCart,
    Utensils,
    ChefHat,
    Users,
    type LucideIcon,
} from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import { RoleName } from "@/types";
import { ROUTES } from "@/app/routes";

interface NavItem {
    name: string;
    path: string;
    icon: LucideIcon;
    /**
     * Roles that can see this item. If undefined, all authenticated users can see it.
     */
    allowedRoles?: RoleName[];
}

const allNavItems: NavItem[] = [
    { name: "Dashboard", path: ROUTES.DASHBOARD, icon: Home },
    { name: "Mesas", path: ROUTES.TABLES, icon: LayoutGrid },
    { name: "Menú", path: ROUTES.MENU, icon: MenuIcon },
    { name: "Pedidos", path: ROUTES.ORDERS, icon: ShoppingCart },
    {
        name: "Cocina",
        path: ROUTES.KITCHEN,
        icon: ChefHat,
        allowedRoles: [RoleName.KITCHEN_MANAGER, RoleName.ADMIN],
    },
    {
        name: "Usuarios",
        path: ROUTES.USERS,
        icon: Users,
        allowedRoles: [RoleName.ADMIN],
    },
];

export function Sidebar() {
    const location = useLocation();
    const { hasAnyRole } = usePermissions();

    // Filter navigation items based on user roles
    const navItems = allNavItems.filter((item) => {
        // If no allowedRoles specified, show to all authenticated users
        if (!item.allowedRoles || item.allowedRoles.length === 0) {
            return true;
        }
        // Check if user has at least one of the allowed roles
        return hasAnyRole(item.allowedRoles);
    });

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-sage-border-subtle">
            {/* Logo Section */}
            <div className="h-20 flex items-center px-6 border-b border-sage-border-subtle">
                <Link to={ROUTES.DASHBOARD} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sage-green-100 rounded-xl flex items-center justify-center">
                        <Utensils className="w-6 h-6 text-sage-green-600" />
                    </div>
                    <span className="text-xl font-bold text-carbon-900">Plates</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-2">
                {navItems.map((item) => {
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
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${isActive ? "bg-sage-green-50 text-sage-green-700 shadow-soft-sm" : "text-sage-green-700 hover:bg-sage-50"}`}
                        >
                            <Icon className="w-5 h-5" />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
