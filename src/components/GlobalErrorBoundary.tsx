/**
 * GLOBAL ERROR BOUNDARY COMPONENT
 *
 * React Error Boundary that catches JavaScript errors anywhere in the
 * child component tree and displays a fallback UI.
 *
 * Features:
 * - Catches React rendering errors
 * - Catches event handler errors
 * - Provides error details for debugging
 * - Allows retry via error reset signal
 */

import { Component, type ReactNode } from "react";
import type { ErrorInfo } from "react";
import { motion } from "framer-motion";
import { ChefHat, RefreshCw, Home, AlertTriangle, Bug } from "lucide-react";
import { Button } from "@/components";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: string | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("[ErrorBoundary] Caught error:", error);
    console.error("[ErrorBoundary] Component stack:", errorInfo.componentStack);

    const componentStack = errorInfo.componentStack || null;
    this.setState({ errorInfo: componentStack });

    if (typeof window !== "undefined") {
      const errorEvent = new CustomEvent("app-error", {
        detail: {
          message: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString(),
        },
      });
      window.dispatchEvent(errorEvent);
    }
  }

  private handleReload = (): void => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  private handleGoHome = (): void => {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback
          error={this.state.error}
          onReload={this.handleReload}
          onGoHome={this.handleGoHome}
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  onReload: () => void;
  onGoHome: () => void;
}

function ErrorFallback({
  error,
  onReload,
  onGoHome,
}: ErrorFallbackProps): ReactNode {
  const isProduction = import.meta.env.PROD;

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
              Encontramos un error inesperado en la aplicación
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

          {!isProduction && error && (
            <div className="bg-carbon-900 rounded-xl p-4 mb-6 text-left overflow-auto max-h-48">
              <p className="text-error-400 font-mono text-sm mb-2 flex items-center gap-2">
                <Bug className="w-4 h-4" />
                Error Details
              </p>
              <p className="text-error-300 font-mono text-xs mb-2">
                {error.message}
              </p>
              {error.stack && (
                <pre className="text-carbon-400 font-mono text-xs overflow-auto">
                  {error.stack.split("\n").slice(0, 10).join("\n")}
                </pre>
              )}
            </div>
          )}

          <div className="bg-carbon-50 rounded-xl p-4 mb-6">
            <p className="text-carbon-600 text-sm text-center">
              {isProduction
                ? "Hemos registrado este error y trabajaremos para solucionarlo."
                : "El error ha sido registrado en la consola del navegador."}
            </p>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onReload} className="flex-1">
              <RefreshCw className="w-4 h-4 mr-2" />
              Recargar
            </Button>
            <Button variant="primary" onClick={onGoHome} className="flex-1">
              <Home className="w-4 h-4 mr-2" />
              Ir al Inicio
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default ErrorBoundary;

export { ErrorBoundary };
