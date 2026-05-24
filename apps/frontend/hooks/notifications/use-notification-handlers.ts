import { NotificationEventData } from "@/components/molecules/providers/notification-setup/notification-listener";
import { toast } from "@/components/ui/toast";
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
          toast.info(data.title, {
            description: data.body,
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
