import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "@/components/ui/toast";

export const useBlock = ({
  duration = 3000,
  message = "Please wait a moment",
  shouldLock = false,
}: {
  duration?: number;
  message?: string;
  shouldLock: boolean;
}) => {
  const [isLocked, setIsLocked] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const forceLock = useCallback(() => {
    setIsLocked((locked) => {
      if (locked) return locked;

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setIsLocked(false);
      }, duration);

      return true;
    });
  }, [duration]);

  const reset = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsLocked(false);
  }, []);

  useEffect(() => {
    if (shouldLock) {
      forceLock();
      toast.warning(message);
    }
  }, [shouldLock, forceLock, message]);

  return {
    isLocked,
    forceLock,
    reset,
  };
};
