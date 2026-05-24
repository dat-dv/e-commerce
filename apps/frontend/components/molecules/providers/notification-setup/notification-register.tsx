"use client";

import { toast } from "@/components/ui/toast";
import { PUBLIC_ENV } from "@/config/public.env.config";
import { TOAST_KEYS, TToastId } from "@/constants/toast.constant";
import { notificationsUseCase } from "@/domain/notifications/use-cases";
import { emitNotificationRefresh } from "@/hooks/notifications/notification-sync";
import { getFirebaseMessaging } from "@/lib/firebase";
import { getToken, onMessage } from "firebase/messaging";
import { useEffect } from "react";

type NotificationRegisterProps = {
  userId: string;
  onReady: () => void;
};

export default function NotificationRegister({
  userId,
  onReady,
}: NotificationRegisterProps) {
  useEffect(() => {
    if (!PUBLIC_ENV.NEXT_PUBLIC_FIREBASE_VAPID_KEY) {
      onReady();
      return;
    }

    if (typeof window === "undefined" || !("Notification" in window)) {
      onReady();
      return;
    }

    let isCancelled = false;
    let unsubscribeForegroundMessage: (() => void) | undefined;

    const setupFirebaseMessaging = async () => {
      try {
        const messaging = await getFirebaseMessaging();

        if (!messaging) {
          onReady();
          return;
        }

        const permission = await Notification.requestPermission();

        if (permission !== "granted") {
          if (PUBLIC_ENV.IS_DEBUG) {
            console.warn("Notification permission not granted");
          }

          if (!isCancelled) onReady();
          return;
        }

        const token = await getToken(messaging, {
          vapidKey: PUBLIC_ENV.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });

        if (token) {
          await notificationsUseCase.saveToken({
            token,
            deviceType: "web",
          });
        }

        unsubscribeForegroundMessage = onMessage(messaging, (payload) => {
          if (PUBLIC_ENV.IS_DEBUG) {
            console.info("Foreground message received:", payload);
          }

          if (!payload.notification) return;

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
        });

        if (!isCancelled) onReady();
      } catch (error) {
        if (PUBLIC_ENV.IS_DEBUG) {
          console.warn("Error setting up Firebase notifications:", error);
        }

        if (!isCancelled) onReady();
      }
    };

    void setupFirebaseMessaging();

    return () => {
      isCancelled = true;
      unsubscribeForegroundMessage?.();
    };
  }, [onReady, userId]);

  return null;
}
