"use client";

import { PUBLIC_ENV } from "@/config/public.env.config";
import { notificationsUseCase } from "@/domain/notifications/use-cases";
import { getFirebaseMessaging } from "@/lib/firebase";
import { ENotificationClientEvent } from "@ecommerce/shared";
import { getToken, onMessage } from "firebase/messaging";
import { useEffect } from "react";

export type NotificationEventData = {
  type?: ENotificationClientEvent;
  id?: string;
  url?: string;
  orderId?: string;
  productId?: string;
  notificationId?: string;
  status?: string;
  title?: string;
  body?: string;
  [key: string]: string | undefined;
};

interface NotificationListenerProps {
  userId: string;
  onNotificationChanged: (
    type: ENotificationClientEvent,
    data?: NotificationEventData,
  ) => void | Promise<void>;
}

export default function NotificationListener({
  userId,
  onNotificationChanged,
}: NotificationListenerProps) {
  useEffect(() => {
    if (!userId) return;
    if (!PUBLIC_ENV.NEXT_PUBLIC_FIREBASE_VAPID_KEY) return;
    if (typeof window === "undefined") return;
    if (!("Notification" in window)) return;

    let unsubscribeForeground: (() => void) | undefined;
    let isMounted = true;

    const handleServiceWorkerMessage = (event: MessageEvent) => {
      void onNotificationChanged(event.data?.type, event.data.notification);
    };

    const setup = async () => {
      try {
        if ("serviceWorker" in navigator) {
          navigator.serviceWorker.addEventListener(
            "message",
            handleServiceWorkerMessage,
          );
        }

        const messaging = await getFirebaseMessaging();

        if (!isMounted || !messaging) return;

        const permission = await Notification.requestPermission();

        if (permission !== "granted") return;

        const token = await getToken(messaging, {
          vapidKey: PUBLIC_ENV.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });

        if (token) {
          await notificationsUseCase.saveToken({
            token,
            deviceType: "web",
          });
        }

        if (!isMounted) return;

        unsubscribeForeground = onMessage(messaging, (payload) => {
          const clientEventType =
            (payload.data?.clientEvent as ENotificationClientEvent) ||
            ENotificationClientEvent.CHANGED;

          void onNotificationChanged(clientEventType, {
            ...payload.data,
            title: payload.notification?.title || payload.data?.title,
            body: payload.notification?.body || payload.data?.body,
          });
        });
      } catch {
        // ignore setup error
      }
    };

    void setup();

    return () => {
      isMounted = false;

      unsubscribeForeground?.();

      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.removeEventListener(
          "message",
          handleServiceWorkerMessage,
        );
      }
    };
  }, [userId, onNotificationChanged]);

  return null;
}
