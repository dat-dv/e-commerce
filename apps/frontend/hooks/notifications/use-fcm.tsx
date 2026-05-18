import { useEffect } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "@/lib/firebase";
import { notificationsUseCase } from "@/domain/notifications/use-cases";
import { PUBLIC_ENV } from "@/config/public.env.config";
import { useAuthStore } from "../auth/use-auth-store";
import { toast } from "react-toastify";
import React from "react";

export const useFCM = () => {
  const user = useAuthStore((s) => s.user);
  const isInitialized = React.useRef(false);

  useEffect(() => {
    if (!user || isInitialized.current) return;
    if (!PUBLIC_ENV.NEXT_PUBLIC_FIREBASE_VAPID_KEY) return;
    if (typeof window === "undefined" || !("Notification" in window)) return;

    const setupFCM = async () => {
      isInitialized.current = true;

      try {
        const messaging = await getFirebaseMessaging();
        if (!messaging) return;

        // Request permission
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          if (PUBLIC_ENV.IS_DEBUG) {
            console.warn("Notification permission not granted");
          }
          return;
        }

        // Get token
        const token = await getToken(messaging, {
          vapidKey: PUBLIC_ENV.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });

        if (token) {
          try {
            await notificationsUseCase.saveToken({
              token,
              device_type: "web",
            });
          } catch (error) {
            if (PUBLIC_ENV.IS_DEBUG) {
              console.warn("Failed to save FCM token:", error);
            }
          }
        }

        // Listen for foreground messages
        onMessage(messaging, (payload) => {
          if (PUBLIC_ENV.IS_DEBUG) {
            console.info("Foreground message received:", payload);
          }
          if (payload.notification) {
            toast.info(
              <div className="flex flex-col gap-1">
                <p className="text-sm font-bold text-content leading-none">
                  {payload.notification.title}
                </p>
                <p className="text-xs text-content/60 leading-tight">
                  {payload.notification.body}
                </p>
              </div>,
              {
                icon: <span>🔔</span>,
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                className:
                  "bg-surface border border-content/[0.05] rounded-2xl shadow-2xl",
              },
            );
          }
        });
      } catch (error) {
        if (PUBLIC_ENV.IS_DEBUG) {
          console.warn("Error setting up FCM:", error);
        }
      }
    };

    setupFCM();
  }, [user]);
};
