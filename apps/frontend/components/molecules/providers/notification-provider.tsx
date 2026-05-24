"use client";

import { notificationsUseCase } from "@/domain/notifications/use-cases";
import { useAuthStore } from "@/hooks/auth/use-auth-store";
import {
  createNotificationBroadcastChannel,
  emitNotificationRefresh,
  isNotificationSyncMessage,
} from "@/hooks/notifications/notification-sync";
import { useFCM } from "@/hooks/notifications/use-fcm";
import { useVisibilityChange } from "@/hooks/utils/use-visibility-change";
import { useWindowFocus } from "@/hooks/utils/use-window-focus";
import { useNotificationStore } from "@/store/notification-store";
import { ENotificationClientEvent } from "@ecommerce/shared";
import { ReactNode, useCallback, useEffect } from "react";

type NotificationSyncResult = [
  Awaited<ReturnType<typeof notificationsUseCase.getNotifications>>,
  Awaited<ReturnType<typeof notificationsUseCase.getUnreadCount>>,
];

type NotificationSyncOptions = {
  force?: boolean;
};

const NOTIFICATION_SYNC_DEDUPE_MS = 1000;
const NOTIFICATION_PAGE_LIMIT = 20;

let notificationSyncPromise: Promise<NotificationSyncResult> | null = null;
let lastNotificationSyncResult: NotificationSyncResult | null = null;
let lastNotificationSyncAt = 0;

const isNotificationSyncResultFresh = (
  result: NotificationSyncResult | null,
): result is NotificationSyncResult =>
  Boolean(result) &&
  Date.now() - lastNotificationSyncAt < NOTIFICATION_SYNC_DEDUPE_MS;

const fetchNotificationSync = () =>
  Promise.all([
    notificationsUseCase.getNotifications({
      page: 1,
      limit: NOTIFICATION_PAGE_LIMIT,
    }),
    notificationsUseCase.getUnreadCount(),
  ]);

const requestNotificationSync = ({
  force = false,
}: NotificationSyncOptions = {}): Promise<NotificationSyncResult> => {
  if (notificationSyncPromise) {
    return notificationSyncPromise;
  }

  if (!force && isNotificationSyncResultFresh(lastNotificationSyncResult)) {
    return Promise.resolve(lastNotificationSyncResult);
  }

  notificationSyncPromise = fetchNotificationSync()
    .then((result) => {
      lastNotificationSyncResult = result;
      lastNotificationSyncAt = Date.now();
      return result;
    })
    .finally(() => {
      notificationSyncPromise = null;
    });

  return notificationSyncPromise;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  useFCM();

  const user = useAuthStore((s) => s.user);
  const reset = useNotificationStore((s) => s.reset);
  const setNotifications = useNotificationStore((s) => s.setNotifications);
  const setUnreadCount = useNotificationStore((s) => s.setUnreadCount);

  const applyNotificationSyncResult = useCallback(
    ([noti, count]: NotificationSyncResult) => {
      if (noti.status === "success") {
        setNotifications(noti.data);
      }

      if (count.status === "success") {
        setUnreadCount(count.data.count);
      }
    },
    [setNotifications, setUnreadCount],
  );

  const syncFromServer = useCallback(
    async (options?: NotificationSyncOptions) => {
      if (!user) {
        return;
      }

      const result = await requestNotificationSync(options);
      applyNotificationSyncResult(result);
    },
    [applyNotificationSyncResult, user],
  );

  const handleWindowFocus = useCallback(() => {
    void syncFromServer();
  }, [syncFromServer]);

  const handleVisibilityChange = useCallback(
    (isVisible: boolean) => {
      if (isVisible) {
        void syncFromServer();
      }
    },
    [syncFromServer],
  );

  useWindowFocus(handleWindowFocus);
  useVisibilityChange(handleVisibilityChange);

  useEffect(() => {
    if (!user) {
      reset();
      return;
    }

    const handleRefresh = () => {
      void syncFromServer({ force: true });
    };

    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (isNotificationSyncMessage(event.data)) {
        emitNotificationRefresh(false);
      }
    };

    const channel = createNotificationBroadcastChannel();
    const handleBroadcastMessage = (event: MessageEvent) => {
      if (isNotificationSyncMessage(event.data)) {
        void syncFromServer();
      }
    };
    channel?.addEventListener("message", handleBroadcastMessage);

    void syncFromServer();

    window.addEventListener(ENotificationClientEvent.REFRESH, handleRefresh);
    navigator.serviceWorker?.addEventListener(
      "message",
      handleServiceWorkerMessage,
    );

    return () => {
      window.removeEventListener(
        ENotificationClientEvent.REFRESH,
        handleRefresh,
      );
      navigator.serviceWorker?.removeEventListener(
        "message",
        handleServiceWorkerMessage,
      );
      channel?.removeEventListener("message", handleBroadcastMessage);
      channel?.close();
    };
  }, [reset, syncFromServer, user]);

  return children;
};
