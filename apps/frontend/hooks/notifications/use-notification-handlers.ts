import { NotificationEventData } from "@/components/molecules/providers/notification-setup/notification-listener.types.ts";
import { toast } from "@/components/ui/toast";
import { TOAST_KEYS } from "@/constants/toast.constant";
import { useUnreadCount } from "@/hooks/notifications/use-unread-count";
import { ENotificationClientEvent } from "@ecommerce/shared";
import { useMemo } from "react";

export const useNotificationHandlers = () => {
  const { loadUnreadCount } = useUnreadCount();

  const notificationHandlers: Record<
    ENotificationClientEvent,
    (data?: NotificationEventData) => void
  > = useMemo(
    () => ({
      [ENotificationClientEvent.CHANGED]: (data?: NotificationEventData) => {
        console.log("Notification changed", data);
        loadUnreadCount();
        if (data?.title) {
          const toastId = data.orderId
            ? TOAST_KEYS.ORDER_PLACE(data.orderId)
            : undefined;
          toast.info(data.title, {
            description: data.body,
            id: toastId,
          });
        }
      },
      [ENotificationClientEvent.REFRESH]: (data?: NotificationEventData) => {
        console.log("Notification refreshed", data);
        loadUnreadCount();
      },
    }),
    [loadUnreadCount],
  );

  return notificationHandlers;
};
