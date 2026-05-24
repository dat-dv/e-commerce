"use client";

import { PUBLIC_ENV } from "@/config/public.env.config";
import { notificationsUseCase } from "@/domain/notifications/use-cases";
import { getFirebaseMessaging } from "@/lib/firebase";
import { ENotificationClientEvent } from "@ecommerce/shared";
import { getToken, onMessage } from "firebase/messaging";
import { useEffect, useRef } from "react";
import { NotificationListenerProps } from "./notification-listener.types.ts";

const normalizePayload = (
  data?: Record<string, string>,
  notification?: { title?: string; body?: string },
) => ({
  ...data,
  title: notification?.title ?? data?.title,
  body: notification?.body ?? data?.body,
});

const getClientEventType = (raw?: string): ENotificationClientEvent =>
  (raw as ENotificationClientEvent | undefined) ??
  ENotificationClientEvent.CHANGED;

export default function NotificationListener({
  userId,
  onNotificationChanged,
}: NotificationListenerProps) {
  const onNotificationChangedRef = useRef(onNotificationChanged);
  const lastSavedTokenKeyRef = useRef<string | null>(null);
  const saveTokenPromiseMapRef = useRef(new Map<string, Promise<void>>());

  useEffect(() => {
    onNotificationChangedRef.current = onNotificationChanged;
  }, [onNotificationChanged]);

  useEffect(() => {
    if (!PUBLIC_ENV.NEXT_PUBLIC_FIREBASE_VAPID_KEY) return;
    if (typeof window === "undefined") return;
    if (!("Notification" in window)) return;

    let unsubscribeForeground: (() => void) | undefined;
    let isMounted = true;

    const handleServiceWorkerMessage = (event: MessageEvent) => {
      const type = getClientEventType(event.data?.type);
      void onNotificationChangedRef.current(type, event.data?.notification);
    };

    const saveTokenOnce = async (token: string): Promise<void> => {
      const tokenKey = `${userId}:${token}`;

      if (lastSavedTokenKeyRef.current === tokenKey) return;

      const existingPromise = saveTokenPromiseMapRef.current.get(tokenKey);
      if (existingPromise) {
        await existingPromise;
        return;
      }

      const savePromise = notificationsUseCase
        .saveToken({ token, deviceType: "web" })
        .then(() => {
          lastSavedTokenKeyRef.current = tokenKey;
        })
        .finally(() => {
          saveTokenPromiseMapRef.current.delete(tokenKey);
        });

      saveTokenPromiseMapRef.current.set(tokenKey, savePromise);

      await savePromise;
    };

    const setup = async (): Promise<void> => {
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
        if (!isMounted || permission !== "granted") return;

        const token = await getToken(messaging, {
          vapidKey: PUBLIC_ENV.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });
        if (!isMounted || !token) return;

        await saveTokenOnce(token);
        if (!isMounted) return;

        unsubscribeForeground = onMessage(messaging, (payload) => {
          const type = getClientEventType(payload.data?.clientEvent);
          void onNotificationChangedRef.current(
            type,
            normalizePayload(payload.data, payload.notification),
          );
        });
      } catch (error) {
        console.warn("[NotificationListener] Setup failed:", error);
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
  }, [userId]);

  return null;
}
