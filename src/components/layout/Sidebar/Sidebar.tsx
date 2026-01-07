import { Link, useLocation } from "react-router-dom";
import {
    Home,
    LayoutGrid,
    MenuIcon,
    ShoppingCart,
    Utensils,
    type LucideIcon,
} from "lucide-react";

interface NavItem {
    name: string;
    path: string;
    icon: LucideIcon;
}

const navItems: NavItem[] = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Mesas", path: "/tables", icon: LayoutGrid },
    { name: "Menú", path: "/menu", icon: MenuIcon },
    { name: "Orders", path: "/orders", icon: ShoppingCart },
];

export function Sidebar() {
    const location = useLocation();

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
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
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
