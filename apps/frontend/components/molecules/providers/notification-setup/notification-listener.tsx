"use client";

import { PUBLIC_ENV } from "@/config/public.env.config";
import { notificationsUseCase } from "@/domain/notifications/use-cases";
import { getFirebaseMessaging } from "@/lib/firebase";
import { ENotificationClientEvent } from "@ecommerce/shared";
import { getToken } from "firebase/messaging";
import { useEffect, useRef } from "react";
import { NotificationListenerProps } from "./notification-listener.types.ts";

const getClientEventType = (raw?: string): ENotificationClientEvent =>
  (raw as ENotificationClientEvent | undefined) ??
  ENotificationClientEvent.CHANGED;

export default function NotificationListener({
  userId,
  onNotificationChanged,
}: NotificationListenerProps) {
  const lastSavedTokenKeyRef = useRef<string | null>(null);
  const saveTokenPromiseMapRef = useRef(new Map<string, Promise<void>>());

  useEffect(() => {
    if (!PUBLIC_ENV.NEXT_PUBLIC_FIREBASE_VAPID_KEY) return;
    if (typeof window === "undefined") return;
    if (!("Notification" in window)) return;

    const handleServiceWorkerMessage = (event: MessageEvent) => {
      const type = getClientEventType(event.data?.type);
      void onNotificationChanged(type, event.data);
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
        if (!messaging) return;

        const permission = await Notification.requestPermission();
        if (permission !== "granted") return;

        const token = await getToken(messaging, {
          vapidKey: PUBLIC_ENV.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });
        if (!token) return;

        await saveTokenOnce(token);
      } catch (error) {
        console.warn("[NotificationListener] Setup failed:", error);
      }
    };

    void setup();

    return () => {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.removeEventListener(
          "message",
          handleServiceWorkerMessage,
        );
      }
    };
  }, [onNotificationChanged, userId]);

  return null;
}
