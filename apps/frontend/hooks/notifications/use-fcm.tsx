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

  useEffect(() => {
    const setupFCM = async () => {
      if (!user) return;

      try {
        const messaging = await getFirebaseMessaging();
        if (!messaging) return;

        // Request permission
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          console.warn("Notification permission not granted");
          return;
        }

        // Get token
        const token = await getToken(messaging, {
          vapidKey: PUBLIC_ENV.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });

        if (token) {
          // Save token to backend
          await notificationsUseCase.saveToken({
            token,
            device_type: "web",
          });
          console.log("FCM Token saved successfully");
        }

        // Listen for foreground messages
        onMessage(messaging, (payload) => {
          console.log("Foreground message received:", payload);
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
        console.error("Error setting up FCM:", error);
      }
    };

    setupFCM();
  }, [user]);
};
