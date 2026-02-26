/**
 * PRIVATE ROUTE COMPONENT
 *
 * Protects routes that require authentication.
 * If user is not logged in, redirects to login page.
 * Includes timeout protection and retry functionality.
 */

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks";
import type React from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { WifiOff, RefreshCw, LogOut } from "lucide-react";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const LOADING_TIMEOUT = 15000;

const LoadingScreen = () => (
  <div className="min-h-screen bg-sage-50 flex items-center justify-center p-6">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-md w-full"
    >
      <div className="glass-light rounded-3xl p-10 shadow-soft-xl text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-sage-400 border-t-sage-600 rounded-full mx-auto mb-6"
        />
        <p className="text-carbon-600">Verificando sesión...</p>
      </div>
    </motion.div>
  </div>
);

const ConnectionErrorScreen = ({
  onRetry,
  message,
}: {
  onRetry: () => void;
  message?: string;
}) => (
  <div className="min-h-screen bg-sage-50 flex items-center justify-center p-6">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-md w-full"
    >
      <div className="glass-light rounded-3xl p-10 shadow-soft-xl text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-20 h-20 rounded-full bg-warning-100 flex items-center justify-center mx-auto mb-6"
        >
          <WifiOff className="w-10 h-10 text-warning-600" />
        </motion.div>

        <h1 className="text-2xl font-bold text-carbon-900 mb-4">
          Sin conexión
        </h1>

        <p className="text-carbon-600 mb-6">
          {message ||
            "No se pudo conectar con el servidor. Verifica tu conexión a internet."}
        </p>

        <motion.button
          onClick={onRetry}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-sage-600 text-white font-semibold rounded-xl hover:bg-sage-700 transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
          Reintentar
        </motion.button>
      </div>
    </motion.div>
  </div>
);

const SessionExpiredScreen = ({ onGoToLogin }: { onGoToLogin: () => void }) => (
  <div className="min-h-screen bg-sage-50 flex items-center justify-center p-6">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-md w-full"
    >
      <div className="glass-light rounded-3xl p-10 shadow-soft-xl text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-20 h-20 rounded-full bg-error-100 flex items-center justify-center mx-auto mb-6"
        >
          <LogOut className="w-10 h-10 text-error-600" />
        </motion.div>

        <h1 className="text-2xl font-bold text-carbon-900 mb-4">
          Tu sesión ha terminado
        </h1>

        <p className="text-carbon-600 mb-6">
          Por seguridad, tu sesión ha expirado. Por favor inicia sesión
          nuevamente.
        </p>

        <motion.button
          onClick={onGoToLogin}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-sage-600 text-white font-semibold rounded-xl hover:bg-sage-700 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Ir al inicio de sesión
        </motion.button>
      </div>
    </motion.div>
  </div>
);

export function PrivateRoute({ children }: PrivateRouteProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, error, retryAuth } = useAuth();
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
    try {
      await retryAuth();
    } catch {
      // Error handled by auth context, will show error screen
    }
  };

  const handleGoToLogin = () => {
    navigate("/login", { state: { from: location.pathname } });
  };

  if (isLoading) {
    if (showTimeout) {
      return <ConnectionErrorScreen onRetry={handleRetry} />;
    }
    return <LoadingScreen />;
  }

  if (error?.type === "AUTH") {
    return <SessionExpiredScreen onGoToLogin={handleGoToLogin} />;
  }

  if (error?.type === "NETWORK") {
    return (
      <ConnectionErrorScreen onRetry={handleRetry} message={error.message} />
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
