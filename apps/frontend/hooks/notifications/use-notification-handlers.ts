import {
  FirebaseServiceWorkerMessagePayload,
  NotificationEventData,
} from "@/components/molecules/providers/notification-setup/notification-listener.types.ts";
import { toast } from "@/components/ui/toast";
import { TOAST_KEYS } from "@/constants/toast.constant";
import { useUnreadCount } from "@/hooks/notifications/use-unread-count";
import { ENotificationClientEvent } from "@ecommerce/shared";
import { useMemo } from "react";

export const useNotificationHandlers = () => {
  const { loadUnreadCount } = useUnreadCount();

  const notificationHandlers: Record<
    ENotificationClientEvent,
    (data?: FirebaseServiceWorkerMessagePayload) => void
  > = useMemo(
    () => ({
      [ENotificationClientEvent.CHANGED]: (data?: NotificationEventData) => {
        console.log("ENotificationClientEvent.CHANGED", JSON.stringify(data));
        loadUnreadCount();

        const notiInfo = data?.notification;
        if (notiInfo?.title) {
          const toastId = data?.data?.orderId
            ? TOAST_KEYS.ORDER_PLACE(data.data.orderId)
            : undefined;
          console.log("INFO TOAST ID:", toastId);
          toast.info(notiInfo.title, {
            description: notiInfo.body,
            id: toastId,
          });
        }
      },
      [ENotificationClientEvent.REFRESH]: (data?: NotificationEventData) => {
        console.log("ENotificationClientEvent.REFRESH", data);
        loadUnreadCount();
      },
    }),
    [loadUnreadCount],
  );

  return notificationHandlers;
};
