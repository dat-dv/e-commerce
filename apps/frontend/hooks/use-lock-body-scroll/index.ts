"use client";

import { useEffect } from "react";

let lockCount = 0;
let originalBodyOverflow = "";
let originalBodyPaddingRight = "";

export function useLockBodyScroll(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return;

    if (lockCount === 0) {
      originalBodyOverflow = document.body.style.overflow;
      originalBodyPaddingRight = document.body.style.paddingRight;

      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = "hidden";
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        document.documentElement.style.setProperty(
          "--scrollbar-width",
          `${scrollbarWidth}px`,
        );
      }
    }

    lockCount += 1;

    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        setTimeout(() => {
          if (lockCount === 0) {
            document.body.style.overflow = originalBodyOverflow;
            document.body.style.paddingRight = originalBodyPaddingRight;
            document.documentElement.style.removeProperty("--scrollbar-width");
          }
        }, 300);
      }
    };
  }, [isLocked]);
}
