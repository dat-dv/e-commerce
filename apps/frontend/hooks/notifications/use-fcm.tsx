import { toast } from "@/components/ui/toast";
import { PUBLIC_ENV } from "@/config/public.env.config";
import { TOAST_KEYS, TToastId } from "@/constants/toast.constant";
import { notificationsUseCase } from "@/domain/notifications/use-cases";
import { getFirebaseMessaging } from "@/lib/firebase";
import { getToken, onMessage } from "firebase/messaging";
import React, { useEffect } from "react";
import { useAuthStore } from "../auth/use-auth-store";
import { emitNotificationRefresh } from "./notification-sync";

export const useFCM = () => {
  const user = useAuthStore((s) => s.user);
  const initializedUserId = React.useRef<string | null>(null);

  useEffect(() => {
    if (!user) {
      initializedUserId.current = null;
      return;
    }

    const userId = user.id;
    if (!userId || initializedUserId.current === userId) return;
    if (!PUBLIC_ENV.NEXT_PUBLIC_FIREBASE_VAPID_KEY) return;
    if (typeof window === "undefined" || !("Notification" in window)) return;

    const setupFCM = async () => {
      initializedUserId.current = userId;

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
              deviceType: "web",
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
            emitNotificationRefresh();

            const orderId = payload.data?.orderId || payload.data?.id;
            const status = payload.data?.status;
            let toastId: TToastId | undefined = undefined;

            if (orderId) {
              if (
                status === "cancelled" ||
                payload.notification.title?.toLowerCase().includes("cancel")
              ) {
                toastId = TOAST_KEYS.ORDER_CANCEL(orderId);
              } else {
                toastId = TOAST_KEYS.ORDER_PLACE(orderId);
              }
            }

            toast.info(payload.notification.title || "Notification", {
              id: toastId,
              description: payload.notification.body || "",
            });
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
