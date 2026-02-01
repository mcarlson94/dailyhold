import { useCallback, useEffect, useRef } from "react";

export function useWakeLock() {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const isActiveRef = useRef(false);

  const isSupported = typeof navigator !== "undefined" && 
    "wakeLock" in navigator;

  const requestWakeLock = useCallback(async () => {
    if (!isSupported) {
      return false;
    }

    try {
      wakeLockRef.current = await navigator.wakeLock.request("screen");
      isActiveRef.current = true;

      wakeLockRef.current.addEventListener("release", () => {
        isActiveRef.current = false;
      });

      return true;
    } catch {
      return false;
    }
  }, [isSupported]);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLockRef.current && !wakeLockRef.current.released) {
      try {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
        isActiveRef.current = false;
      } catch {
        // Release failed - ignore silently
      }
    }
  }, []);

  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible" && isActiveRef.current) {
        await requestWakeLock();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (wakeLockRef.current && !wakeLockRef.current.released) {
        wakeLockRef.current.release();
      }
    };
  }, [requestWakeLock]);

  return {
    isSupported,
    requestWakeLock,
    releaseWakeLock,
  };
}
