/**
 * OFFLINE INDICATOR COMPONENT
 *
 * Shows a banner when the browser is offline.
 * Automatically dismisses when connection is restored.
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, RefreshCw, CheckCircle } from "lucide-react";
import { Button } from "@/components";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

interface OfflineIndicatorProps {
  position?: "top" | "bottom";
  showReconnectButton?: boolean;
}

export default function OfflineIndicator({
  position = "top",
  showReconnectButton = true,
}: OfflineIndicatorProps) {
  const { isOnline, wasOffline, checkConnection } = useOnlineStatus();
  const [showRestoreAnimation, setShowRestoreAnimation] = useState(false);

  useEffect(() => {
    if (isOnline && wasOffline) {
      setShowRestoreAnimation(true);
      const timer = setTimeout(() => {
        setShowRestoreAnimation(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, wasOffline]);

  const handleReconnect = async (): Promise<void> => {
    const online = await checkConnection();
    if (online) {
      setShowRestoreAnimation(true);
      setTimeout(() => setShowRestoreAnimation(false), 3000);
    }
  };

  if (isOnline && !showRestoreAnimation) {
    return null;
  }

  return (
    <AnimatePresence>
      {showRestoreAnimation ? (
        <motion.div
          initial={{ opacity: 0, y: position === "top" ? -20 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: position === "top" ? -20 : 20 }}
          className={`fixed ${position === "top" ? "top-0" : "bottom-0"} left-0 right-0 z-50`}
        >
          <div className="bg-green-500 text-white px-4 py-3 flex items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Conexión restaurada</span>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: position === "top" ? -50 : 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: position === "top" ? -50 : 50 }}
          className={`fixed ${position === "top" ? "top-0" : "bottom-0"} left-0 right-0 z-50`}
        >
          <div className="bg-red-500 text-white px-4 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <WifiOff className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">Sin conexión a internet</span>
              </div>
              {showReconnectButton && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReconnect}
                  className="bg-white/20 border-white/40 text-white hover:bg-white/30 flex-shrink-0"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reconectar
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
