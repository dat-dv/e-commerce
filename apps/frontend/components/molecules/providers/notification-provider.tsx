"use client";

import { notificationsUseCase } from "@/domain/notifications/use-cases";
import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { useFCM } from "@/hooks/notifications/use-fcm";
import {
  createNotificationBroadcastChannel,
  emitNotificationRefresh,
  isNotificationSyncMessage,
} from "@/hooks/notifications/notification-sync";
import { useNotificationStore } from "@/store/notification-store";
import { ENotificationClientEvent } from "@ecommerce/shared";
import { ReactNode, useEffect } from "react";

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  useFCM();

  const user = useAuthStore((s) => s.user);
  const reset = useNotificationStore((s) => s.reset);
  const setNotifications = useNotificationStore((s) => s.setNotifications);
  const setUnreadCount = useNotificationStore((s) => s.setUnreadCount);

  useEffect(() => {
    if (!user) {
      reset();
      return;
    }

    const syncFromServer = async () => {
      const [noti, count] = await Promise.all([
        notificationsUseCase.getNotifications({ page: 1, limit: 20 }),
        notificationsUseCase.getUnreadCount(),
      ]);

      if (noti.status === "success") {
        setNotifications(noti.data);
      }

      if (count.status === "success") {
        setUnreadCount(count.data.count);
      }
    };

    const handleRefresh = () => {
      void syncFromServer();
    };

    const handleFocus = () => {
      void syncFromServer();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void syncFromServer();
      }
    };

    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (isNotificationSyncMessage(event.data)) {
        emitNotificationRefresh(false);
      }
    };

    const channel = createNotificationBroadcastChannel();
    channel?.addEventListener("message", (event) => {
      if (isNotificationSyncMessage(event.data)) {
        void syncFromServer();
      }
    });

    void syncFromServer();

    window.addEventListener(ENotificationClientEvent.REFRESH, handleRefresh);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    navigator.serviceWorker?.addEventListener(
      "message",
      handleServiceWorkerMessage,
    );

    return () => {
      window.removeEventListener(
        ENotificationClientEvent.REFRESH,
        handleRefresh,
      );
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      navigator.serviceWorker?.removeEventListener(
        "message",
        handleServiceWorkerMessage,
      );
      channel?.close();
    };
  }, [reset, setNotifications, setUnreadCount, user]);

  return children;
};
