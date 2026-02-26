import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { RoleName } from "@/types";
import { Navigate } from "react-router-dom";
import { ROUTES } from "@/app/routes";

/**
 * RoleProtectedRoute Props
 */
export interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: RoleName[];
  fallbackRoute?: string;
  showMessage?: boolean;
}

/**
 * RoleProtectedRoute Component
 * 
 * Protects routes based on user roles.
 * 
 * IMPORTANT: This is for UX only. Real security is in the backend.
 * The backend will reject unauthorized requests regardless of frontend checks.
 * 
 * @example
 * ```tsx
 * <RoleProtectedRoute allowedRoles={[RoleName.ADMIN, RoleName.WAITER]}>
 *   <AdminPage />
 * </RoleProtectedRoute>
 * ```
 */
export function RoleProtectedRoute({
  children,
  allowedRoles,
  fallbackRoute = ROUTES.DASHBOARD,
  showMessage = true,
}: RoleProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const { hasAnyRole } = usePermissions();

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-sage-200 border-t-sage-600 mx-auto mb-4"></div>
          <p className="text-carbon-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Check if user has required role
  const hasAccess = hasAnyRole(allowedRoles);

  if (!hasAccess) {
    if (showMessage) {
      // You could show a message here or redirect
      console.warn(
        `Access denied. Required roles: ${allowedRoles.join(", ")}`
      );
    }
    return <Navigate to={fallbackRoute} replace />;
  }

  // User has access, render children
  return <>{children}</>;
}
