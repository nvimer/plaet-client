/**
 * PROTECTED ROUTE COMPONENT
 *
 * Higher-order component for protecting routes that require authentication
 * Redirects to login if user is not authenticated
 * Includes timeout protection and retry functionality
 */

import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth, useUser } from "@/hooks/useEnhancedAuth";
import { ShieldX, WifiOff, RefreshCw } from "lucide-react";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
  fallback?: ReactNode;
  requiredRole?: string;
  requiredPermission?: string;
}

const LOADING_TIMEOUT = 15000;

const LoadingScreen = ({
  onRetry,
  error,
}: {
  onRetry: () => void;
  error?: string;
}) => (
  <div className="min-h-screen bg-sage-50 flex items-center justify-center p-6">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-md w-full"
    >
      <div className="glass-light rounded-[2rem] p-10 shadow-soft-xl text-center">
        {error ? (
          <>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6"
            >
              <WifiOff className="w-10 h-10 text-amber-600" />
            </motion.div>

            <h1 className="text-2xl font-bold text-carbon-900 mb-4">
              Error de Conexión
            </h1>

            <p className="text-carbon-600 mb-6">{error}</p>

            <motion.button
              onClick={onRetry}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-sage-green-600 text-white font-semibold rounded-xl hover:bg-sage-green-700 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Reintentar
            </motion.button>
          </>
        ) : (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-3 border-sage-green-600 border-t-transparent rounded-full mx-auto mb-6"
            />
            <p className="text-carbon-600">Verificando sesión...</p>
          </>
        )}
      </div>
    </motion.div>
  </div>
);

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

export default function ProtectedRoute({
  children,
  redirectTo = "/login",
  requiredRole,
  requiredPermission,
}: ProtectedRouteProps) {
  const location = useLocation();
  const { isAuthenticated, isLoading, error, retryAuth } = useAuth();
  const { hasRole, hasPermission } = useUser();
  const [showTimeout, setShowTimeout] = useState(false);

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        if (isLoading) {
          setShowTimeout(true);
        }
      }, LOADING_TIMEOUT);

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const handleRetry = async () => {
    setShowTimeout(false);
    await retryAuth();
  };

  if (isLoading && showTimeout) {
    return (
      <LoadingScreen
        onRetry={handleRetry}
        error="No se pudo verificar tu sesión. Por favor reintenta."
      />
    );
  }

  if (isLoading) {
    return <LoadingScreen onRetry={handleRetry} />;
  }

  if (!isAuthenticated) {
    return (
      <Navigate to={redirectTo} state={{ from: location.pathname }} replace />
    );
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <AccessDenied
        message={`Se requiere el rol "${requiredRole}" para acceder a esta página.`}
        onBack={() => window.history.back()}
      />
    );
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <AccessDenied
        message="No tienes los permisos necesarios para acceder a esta página."
        onBack={() => window.history.back()}
      />
    );
  }

  return <>{children}</>;
}

interface WithAuthOptions {
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: WithAuthOptions,
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

interface WithRoleOptions {
  fallback?: React.ReactNode;
}

export function withRole<P extends object>(
  Component: React.ComponentType<P>,
  requiredRole: string,
  options?: WithRoleOptions,
) {
  return function RoleProtectedComponent(props: P) {
    return (
      <ProtectedRoute requiredRole={requiredRole} fallback={options?.fallback}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

interface WithPermissionOptions {
  fallback?: React.ReactNode;
}

export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  requiredPermission: string,
  options?: WithPermissionOptions,
) {
  return function PermissionProtectedComponent(props: P) {
    return (
      <ProtectedRoute
        requiredPermission={requiredPermission}
        fallback={options?.fallback}
      >
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}
