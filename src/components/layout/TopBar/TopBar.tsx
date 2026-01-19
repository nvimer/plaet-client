import { Button } from "@/components/ui";
import { useAuth } from "@/hooks";
import { LogOut, User } from "lucide-react";
import { useLocation } from "react-router-dom";
import { ROUTES } from "@/app/routes";

export function TopBar() {
    const { user, logout } = useAuth();
    const location = useLocation();

    // Get page title based on current route
    const getPageTitle = () => {
        switch (location.pathname) {
            case ROUTES.DASHBOARD:
                return "Dashboard";
            case ROUTES.TABLES:
                return "Gestión de Mesas";
            case ROUTES.TABLE_CREATE:
                return "Nueva Mesa";
            case ROUTES.MENU:
                return "Gestión de Menú";
            case ROUTES.ORDERS:
                return "Gestión de Pedidos";
            case ROUTES.ORDER_CREATE:
                return "Nuevo Pedido";
            case ROUTES.KITCHEN:
                return "Vista de Cocina";
            case ROUTES.USERS:
                return "Gestión de Usuarios";
            case ROUTES.USER_CREATE:
                return "Nuevo Usuario";
            case ROUTES.PROFILE:
                return "Mi Perfil";
            case ROUTES.STOCK_MANAGEMENT:
                return "Gestión de Stock";
            default:
                // Handle dynamic routes
                if (location.pathname.includes('/tables/')) {
                    return location.pathname.includes('/edit') ? "Editar Mesa" : "Gestionar Mesa";
                }
                if (location.pathname.includes('/orders/')) {
                    if (location.pathname.includes('/edit')) return "Editar Pedido";
                    return "Detalle de Pedido";
                }
                if (location.pathname.includes('/menu/items/')) {
                    return location.pathname.includes('/edit') ? "Editar Producto" : "Nuevo Producto";
                }
                if (location.pathname.includes('/menu/categories/')) {
                    return location.pathname.includes('/edit') ? "Editar Categoría" : "Nueva Categoría";
                }
                if (location.pathname.includes('/users/')) {
                    return "Editar Usuario";
                }
                return "SazonArte";
        }
    };

    return (
        <header className="h-20 bg-white border-b border-s-sage-border-subtle flex items-center justify-between px-8">
            {/* Page title or breadcrumb */}
            <div>
                <h1 className="text-2xl font-bold text-carbon-900">{getPageTitle()}</h1>
            </div>

            {/* User section */}
            <div className="flex items-center gap-4">
                {/* User info  */}
                <div className="flex items-center gap-3 px-4 py-2 bg-sage-50 rounded-xl">
                    <div className="w-8 h-8 bg-sage-green-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-sage-green-600" />
                    </div>

                    <div className="text-sm">
                        <p className="font-medium text-carbon-900">
                            {user?.firstName.concat(" ", user.lastName) || "Usuario"}
                        </p>
                        <p className="text-carbon-500">{user?.email}</p>
                    </div>
                </div>

                {/* Logout Button  */}
                <Button variant="outline" size="sm" onClick={logout} className="gap-2">
                    <LogOut className="w-4 h-4" />
                    Salir
                </Button>
            </div>
        </header>
    );
}
