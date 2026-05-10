'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

export const useSpamListener = ({
  isSpam,
  message = 'Too many actions! Please wait a moment.',
}: {
  isSpam?: boolean;
  message?: string;
}) => {
  const lastToastTime = useRef<number>(0);
  useEffect(() => {
    if (isSpam) {
      const now = Date.now();
      // Throttling toasts so we don't spam the user with "Please wait"
      if (now - lastToastTime.current > 2000) {
        toast.warning(message, {
          toastId: 'spam-warning',
        });
        lastToastTime.current = now;
      }
    }
  }, [isSpam, message]);
};
