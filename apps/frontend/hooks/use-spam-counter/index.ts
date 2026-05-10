"use client";

import { useCallback, useEffect, useState } from "react";

interface UseSpamCounterOptions {
  maxCount?: number;
  interval?: number;
}

export const useSpamCounter = ({
  maxCount = 3,
  interval = 1000,
}: UseSpamCounterOptions = {}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount(0), interval);
      return () => clearTimeout(timer);
    }
  }, [count, interval]);

  const increment = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  return {
    count,
    isSpam: count >= maxCount,
    increment,
  };
};
