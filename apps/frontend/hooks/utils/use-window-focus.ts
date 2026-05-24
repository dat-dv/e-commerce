import { useEffect } from "react";

export const useWindowFocus = (callback: () => void) => {
  useEffect(() => {
    window.addEventListener("focus", callback);
    return () => {
      window.removeEventListener("focus", callback);
    };
  }, [callback]);
};
