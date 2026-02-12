/**
 * USE ONLINE STATUS HOOK
 *
 * Detects and tracks the online/offline status of the browser.
 * Uses the navigator.onLine API and listens for online/offline events.
 */

import { useState, useEffect, useCallback } from "react";

interface UseOnlineStatusReturn {
  isOnline: boolean;
  wasOffline: boolean;
  lastChecked: Date | null;
  checkConnection: () => Promise<boolean>;
}

export function useOnlineStatus(): UseOnlineStatusReturn {
  const [isOnline, setIsOnline] = useState(true);
  const [wasOffline, setWasOffline] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkConnection = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch("/api/health", {
        method: "HEAD",
        cache: "no-store",
      });
      const online = response.ok;
      setLastChecked(new Date());
      return online;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleOnline = () => {
      setIsOnline(true);
      setWasOffline(true);
      setLastChecked(new Date());
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    setIsOnline(navigator.onLine);
    setLastChecked(new Date());

    const checkInterval = setInterval(() => {
      if (navigator.onLine) {
        checkConnection().then((online) => {
          if (online && !isOnline) {
            handleOnline();
          }
        });
      }
    }, 30000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(checkInterval);
    };
  }, [checkConnection, isOnline]);

  return { isOnline, wasOffline, lastChecked, checkConnection };
}

export default useOnlineStatus;
