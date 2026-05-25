"use client";

import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { useNotificationHandlers } from "@/hooks/notifications/use-notification-handlers";
import { ENotificationClientEvent } from "@ecommerce/shared";
import { Fragment, useCallback } from "react";
import NotificationListener from "./notification-listener";
import { FirebaseServiceWorkerMessagePayload } from "./notification-listener.types.ts";
import NotificationVisibleListener from "./notification-visible-listener";

export default function NotificationSetup() {
  const user = useAuthStore((state) => state.user);
  const isHydrate = useAuthStore((state) => state.hasHydrated);
  const notificationHandlers = useNotificationHandlers();

  const handleNotificationChanged = useCallback(
    (
      type: ENotificationClientEvent,
      data?: FirebaseServiceWorkerMessagePayload,
    ) => {
      console.log("any data receive", data);
      notificationHandlers[type]?.(data);
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
