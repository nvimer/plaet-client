/**
 * ERROR PAGE COMPONENT
 *
 * Standalone error page for manual navigation to error state.
 * Can be used as a route for explicit error navigation.
 */

import { motion } from "framer-motion";
import { ChefHat, RefreshCw, Home, AlertTriangle } from "lucide-react";
import { Button } from "@/components";
import { ROUTES } from "@/app/routes";

function ErrorPage(): React.ReactNode {
  const handleReload = (): void => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  const handleGoHome = (): void => {
    if (typeof window !== "undefined") {
      window.location.href = ROUTES.HOME;
    }
  };

  return (
    <div className="min-h-screen bg-sage-50 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-10 w-96 h-96 bg-sage-green-200 rounded-full blur-3xl opacity-30"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-20 right-10 w-[32rem] h-[32rem] bg-sage-green-100 rounded-full blur-3xl opacity-20"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-lg"
      >
        <div className="glass-light rounded-[2rem] p-10 shadow-soft-xl">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center justify-center mb-6"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-sage flex items-center justify-center shadow-soft-md">
                <ChefHat className="w-10 h-10 text-sage-green-600" />
              </div>
            </motion.div>

            <h1 className="text-3xl font-bold text-carbon-900 mb-2 tracking-tight">
              ¡Ups! Algo salió mal
            </h1>
            <p className="text-carbon-600 font-light">
              Encontramos un error inesperado
            </p>
          </div>

          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-24 h-24 rounded-full bg-error-100 flex items-center justify-center mx-auto mb-6"
          >
            <AlertTriangle className="w-12 h-12 text-error-600" />
          </motion.div>

          <div className="bg-carbon-50 rounded-xl p-4 mb-6">
            <p className="text-carbon-600 text-sm text-center">
              Ha ocurrido un error inesperado. Por favor intenta nuevamente o
              contacta al soporte si el problema persiste.
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleReload} className="flex-1">
              <RefreshCw className="w-4 h-4 mr-2" />
              Recargar
            </Button>
            <Button variant="primary" onClick={handleGoHome} className="flex-1">
              <Home className="w-4 h-4 mr-2" />
              Ir al Inicio
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default ErrorPage;
