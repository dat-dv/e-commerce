"use client";

import { useEffect } from "react";

export const PwaRegister = () => {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js", { scope: "/" })
        .then((reg) => {
          if (process.env.NODE_ENV === "development") {
            console.info(
              "PWA Service Worker registered with scope:",
              reg.scope,
            );
          }
        })
        .catch((err) => {
          console.warn("PWA Service Worker registration failed:", err);
        });
    }
  }, []);

  return null;
};
