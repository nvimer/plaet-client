import { Button } from "@/components/ui";
import { useAuth } from "@/hooks";
import { LogOut, User } from "lucide-react";

export function TopBar() {
    const { user, logout } = useAuth();

    return (
        <header className="h-20 bg-white border-b border-s-sage-border-subtle flex items-center justify-between px-8">
            {/* Page title or breadcrumb */}
            <div>
                <h1 className="text-2xl font-bold text-carbon-900">Dashboard</h1>
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
