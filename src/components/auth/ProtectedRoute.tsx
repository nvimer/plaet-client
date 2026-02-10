/**
 * PROTECTED ROUTE COMPONENT
 *
 * Higher-order component for protecting routes that require authentication
 * Redirects to login if user is not authenticated
 */

import { Navigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useEnhancedAuth";
import { Lock, ShieldX } from "lucide-react";

/**
 * Protected Route Component Props
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  fallback?: React.ReactNode;
  requiredRole?: string;
  requiredPermission?: string;
}

/**
 * Loading Spinner Component
 */
const LoadingSpinner = () => (
  <div className="min-h-screen bg-sage-50 flex items-center justify-center">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="w-8 h-8 border-2 border-sage-green-600 border-t-transparent rounded-full"
    />
  </div>
);

/**
 * Access Denied Component
 */
const AccessDenied = ({
  message,
  onBack,
}: {
  message: string;
  onBack?: () => void;
}) => (
  <div className="min-h-screen bg-sage-50 flex items-center justify-center p-6">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-md w-full"
    >
      <div className="glass-light rounded-[2rem] p-10 shadow-soft-xl text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6"
        >
          <ShieldX className="w-10 h-10 text-red-600" />
        </motion.div>

        <h1 className="text-2xl font-bold text-carbon-900 mb-4">
          Acceso Denegado
        </h1>

        <p className="text-carbon-600 mb-6">{message}</p>

        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center px-6 py-3 bg-sage-green-600 text-white font-semibold rounded-xl hover:bg-sage-green-700 transition-colors"
        >
          Regresar
        </motion.button>
      </div>
    </motion.div>
  </div>
);

/**
 * Protected Route Component
 */
export default function ProtectedRoute({
  children,
  redirectTo = "/login",
  fallback,
  requiredRole,
  requiredPermission,
}: ProtectedRouteProps) {
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return (
      <Navigate to={redirectTo} state={{ from: location.pathname }} replace />
    );
  }

  // Check role-based access
  if (requiredRole) {
    const hasRole = user?.roles?.some(
      (role: any) => role.name === requiredRole,
    );
    if (!hasRole) {
      return (
        <AccessDenied
          message={`Se requiere el rol "${requiredRole}" para acceder a esta página.`}
          onBack={() => window.history.back()}
        />
      );
    }
  }

  // Check permission-based access
  if (requiredPermission) {
    const hasPermission = user?.roles?.some((role: any) =>
      role.permissions?.some(
        (perm: any) => perm.permission?.name === requiredPermission,
      ),
    );

    if (!hasPermission) {
      return (
        <AccessDenied
          message={`No tienes los permisos necesarios para acceder a esta página.`}
          onBack={() => window.history.back()}
        />
      );
    }
  }

  // User is authenticated and has required permissions
  return <>{children}</>;
}

/**
 * Props for withAuth HOC
 */
interface WithAuthProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * HOC for wrapping components that require authentication
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: { redirectTo?: string; fallback?: React.ReactNode },
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute
        redirectTo={options?.redirectTo}
        fallback={options?.fallback}
      >
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

/**
 * Props for withRole HOC
 */
interface WithRoleProps {
  children: React.ReactNode;
  requiredRole: string;
  fallback?: React.ReactNode;
}

/**
 * HOC for components that require specific role
 */
export function withRole<P extends object>(
  Component: React.ComponentType<P>,
  requiredRole: string,
  fallback?: React.ReactNode,
) {
  return function RoleProtectedComponent(props: P) {
    return (
      <ProtectedRoute requiredRole={requiredRole} fallback={fallback}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

/**
 * Props for withPermission HOC
 */
interface WithPermissionProps {
  children: React.ReactNode;
  requiredPermission: string;
  fallback?: React.ReactNode;
}

/**
 * HOC for components that require specific permission
 */
export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  requiredPermission: string,
  fallback?: React.ReactNode,
) {
  return function PermissionProtectedComponent(props: P) {
    return (
      <ProtectedRoute
        requiredPermission={requiredPermission}
        fallback={fallback}
      >
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}
