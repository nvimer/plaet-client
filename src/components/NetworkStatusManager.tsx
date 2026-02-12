/**
 * NETWORK STATUS MANAGER COMPONENT
 *
 * Combines offline detection and session timeout warning.
 * Shows offline banner and session timeout modal for authenticated users.
 */

import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import OfflineIndicator from "./OfflineIndicator";
import SessionTimeoutWarning from "./SessionTimeoutWarning";
import { useAuth } from "@/hooks";

interface NetworkStatusManagerProps {
  children: React.ReactNode;
}

export default function NetworkStatusManager({
  children,
}: NetworkStatusManagerProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleSessionExpired = useCallback(() => {
    logout();
    navigate("/login", {
      state: { message: "Tu sesión ha expirado por inactividad" },
    });
  }, [logout, navigate]);

  useEffect(() => {
    const handleOnline = (): void => {
      console.log("[NetworkStatus] Connection restored");
    };

    const handleOffline = (): void => {
      console.log("[NetworkStatus] Connection lost");
    };

    if (typeof window !== "undefined") {
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      }
    };
  }, []);

  return (
    <>
      <OfflineIndicator position="top" showReconnectButton />
      <SessionTimeoutWarning
        sessionTimeoutMs={25 * 60 * 1000}
        warningBeforeMs={2 * 60 * 1000}
        onSessionExpired={handleSessionExpired}
      />
      {children}
    </>
  );
}
