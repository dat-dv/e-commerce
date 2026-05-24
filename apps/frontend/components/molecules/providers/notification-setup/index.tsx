"use client";

import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { useUnreadCount } from "@/hooks/notifications/use-unread-count";
import { ENotificationClientEvent } from "@ecommerce/shared";
import { Fragment, useCallback, useMemo } from "react";
import NotificationListener, {
  NotificationEventData,
} from "./notification-listener";
import NotificationVisibleListener from "./notification-visible-listener";

export default function NotificationSetup() {
  const user = useAuthStore((state) => state.user);
  const isHydrate = useAuthStore((state) => state.hasHydrated);

  const { loadUnreadCount } = useUnreadCount();

  const notificationHandlers: Record<
    ENotificationClientEvent,
    (data?: NotificationEventData) => void
  > = useMemo(
    () => ({
      [ENotificationClientEvent.CHANGED]: (data?: NotificationEventData) => {
        console.log("Notification changed", data);
        loadUnreadCount();
      },
      [ENotificationClientEvent.REFRESH]: (data?: NotificationEventData) => {
        console.log("Notification refreshed", data);
        loadUnreadCount();
      },
    }),
    [loadUnreadCount],
  );

  const handleNotificationChanged = useCallback(
    (type: ENotificationClientEvent, data?: NotificationEventData) => {
      console.log("Notification received", type, data);
      notificationHandlers[type](data);
    },
    [notificationHandlers],
  );

  if (!isHydrate || !user?.id) return null;

  return (
    <Fragment>
      <NotificationListener
        userId={user.id}
        onNotificationChanged={handleNotificationChanged}
      />
      <NotificationVisibleListener />
    </Fragment>
  );
}
