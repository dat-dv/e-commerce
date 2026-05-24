import { useEffect } from "react";

export const useVisibilityChange = (callback: (isVisible: boolean) => void) => {
  useEffect(() => {
    const handleVisibilityChange = () => {
      callback(document.visibilityState === "visible");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [callback]);
};
