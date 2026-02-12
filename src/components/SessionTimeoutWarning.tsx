/**
 * SESSION TIMEOUT WARNING COMPONENT
 *
 * Shows a warning modal when the user's session is about to expire.
 * Automatically extends session if user clicks "Stay logged in".
 */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, RefreshCw, LogOut, AlertTriangle } from "lucide-react";
import { Button } from "@/components";
import { authApi } from "@/services";
import { toast } from "sonner";

interface SessionTimeoutWarningProps {
  sessionTimeoutMs?: number;
  warningBeforeMs?: number;
  onSessionExpired?: () => void;
}

const DEFAULT_TIMEOUT_MS = 25 * 60 * 1000;
const DEFAULT_WARNING_MS = 2 * 60 * 1000;

export default function SessionTimeoutWarning({
  sessionTimeoutMs = DEFAULT_TIMEOUT_MS,
  warningBeforeMs = DEFAULT_WARNING_MS,
  onSessionExpired,
}: SessionTimeoutWarningProps) {
  const [showWarning, setShowWarning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isExtending, setIsExtending] = useState(false);

  const getTimeUntilExpiry = useCallback((): number => {
    const stored = localStorage.getItem("sessionExpiry");
    if (!stored) return 0;
    const expiry = parseInt(stored, 10);
    return Math.max(0, expiry - Date.now());
  }, []);

  const extendSession = useCallback(async (): Promise<void> => {
    setIsExtending(true);
    try {
      await authApi.refreshToken();
      const newExpiry = Date.now() + sessionTimeoutMs;
      localStorage.setItem("sessionExpiry", newExpiry.toString());
      setShowWarning(false);
      toast.success("Sesión extendida");
    } catch {
      toast.error("No se pudo extender la sesión");
      if (onSessionExpired) {
        onSessionExpired();
      }
    } finally {
      setIsExtending(false);
    }
  }, [sessionTimeoutMs, onSessionExpired]);

  const logout = useCallback((): void => {
    localStorage.removeItem("sessionExpiry");
    if (onSessionExpired) {
      onSessionExpired();
    }
  }, [onSessionExpired]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const initializeSession = (): void => {
      const existingExpiry = localStorage.getItem("sessionExpiry");
      if (!existingExpiry) {
        const expiry = Date.now() + sessionTimeoutMs;
        localStorage.setItem("sessionExpiry", expiry.toString());
      }
    };

    initializeSession();

    const handleActivity = (): void => {
      const expiry = Date.now() + sessionTimeoutMs;
      localStorage.setItem("sessionExpiry", expiry.toString());
    };

    const events = [
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "mousemove",
    ];

    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    const checkInterval = setInterval(() => {
      const timeUntilExpiry = getTimeUntilExpiry();

      if (timeUntilExpiry <= 0) {
        setShowWarning(false);
        if (onSessionExpired) {
          onSessionExpired();
        }
        return;
      }

      if (timeUntilExpiry <= warningBeforeMs && !showWarning) {
        setShowWarning(true);
        setRemainingSeconds(Math.floor(timeUntilExpiry / 1000));
      }

      if (showWarning) {
        setRemainingSeconds(Math.floor(timeUntilExpiry / 1000));
      }
    }, 1000);

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      clearInterval(checkInterval);
    };
  }, [
    getTimeUntilExpiry,
    warningBeforeMs,
    showWarning,
    sessionTimeoutMs,
    onSessionExpired,
  ]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!showWarning) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-carbon-900/50 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
        >
          <div className="bg-amber-50 px-6 py-4 border-b border-amber-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-carbon-900">
                  Sesión por expirar
                </h3>
                <p className="text-sm text-carbon-600">
                  Tu sesión caducará pronto
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Clock className="w-6 h-6 text-amber-600" />
              <span className="text-4xl font-mono font-bold text-carbon-900">
                {formatTime(remainingSeconds)}
              </span>
            </div>

            <p className="text-carbon-600 text-center mb-6">
              Tu sesión está a punto de expirar. ¿Deseas mantenerte conectado?
            </p>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={logout}
                className="flex-1"
                disabled={isExtending}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar sesión
              </Button>
              <Button
                variant="primary"
                onClick={extendSession}
                className="flex-1"
                isLoading={isExtending}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Mantener conectado
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
