import { useCallback, useEffect, useRef } from "react";

export function useWakeLock() {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const isActiveRef = useRef(false);

  const isSupported = typeof navigator !== "undefined" && 
    "wakeLock" in navigator;

  const requestWakeLock = useCallback(async () => {
    if (!isSupported) {
      console.log("Wake Lock API not supported");
      return false;
    }

    try {
      wakeLockRef.current = await navigator.wakeLock.request("screen");
      isActiveRef.current = true;
      
      console.log("Wake Lock activated - screen will stay on");

      wakeLockRef.current.addEventListener("release", () => {
        console.log("Wake Lock released");
        isActiveRef.current = false;
      });

      return true;
    } catch (err) {
      console.log("Wake Lock request failed:", err);
      return false;
    }
  }, [isSupported]);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLockRef.current && !wakeLockRef.current.released) {
      try {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
        isActiveRef.current = false;
        console.log("Wake Lock manually released");
      } catch (err) {
        console.log("Wake Lock release failed:", err);
      }
    }
  }, []);

  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible" && isActiveRef.current) {
        console.log("Page visible again, re-requesting wake lock");
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
