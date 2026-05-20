import { toast } from "@/components/ui/toast";
import { PUBLIC_ENV } from "@/config/public.env.config";
import { notificationsUseCase } from "@/domain/notifications/use-cases";
import { getFirebaseMessaging } from "@/lib/firebase";
import { useNotificationStore } from "@/store/notification-store";
import { ENotificationClientEvent, ENotificationType } from "@ecommerce/shared";
import { getToken, onMessage } from "firebase/messaging";
import React, { useEffect } from "react";
import { useAuthStore } from "../auth/use-auth-store";

const getNotificationType = (type?: string) => {
  const parsedType = Number(type);

  return Object.values(ENotificationType).includes(parsedType)
    ? (parsedType as ENotificationType)
    : ENotificationType.SYSTEM;
};

export const useFCM = () => {
  const user = useAuthStore((s) => s.user);
  const addNotification = useNotificationStore((s) => s.addNotification);
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
            const now = new Date().toISOString();

            addNotification({
              id: payload.messageId || `fcm-${Date.now()}`,
              userId: user.id || "",
              title: payload.notification.title || "Notification",
              content: payload.notification.body || "",
              type: getNotificationType(payload.data?.type),
              link: payload.data?.link || payload.fcmOptions?.link,
              isRead: false,
              metadata: payload.data,
              createdAt: now,
              updatedAt: now,
            });
            window.dispatchEvent(new Event(ENotificationClientEvent.REFRESH));

            toast.info(
              payload.notification.title || "Notification",
              payload.notification.body || undefined,
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
  }, [addNotification, user]);
};
