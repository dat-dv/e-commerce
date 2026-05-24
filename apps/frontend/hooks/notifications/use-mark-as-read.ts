import { notificationsUseCase } from "@/domain/notifications/use-cases";
import { useNotificationStore } from "@/store/notification-store";
import { emitNotificationRefresh } from "./notification-sync";

export const useMarkAsRead = () => {
  const storeNotifications = useNotificationStore((s) => s.data);
  const storeMarkAsRead = useNotificationStore((s) => s.markAsRead);

  const markAsRead = async (id: string) => {
    try {
      const notification = storeNotifications.items.find(
        (item) => item.id === id,
      );

      if (!notification || notification.isRead) return;

      const response = await notificationsUseCase.markAsRead(id);
      if (response.status === "success") {
        storeMarkAsRead(id);
        emitNotificationRefresh();
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return {
    markAsRead,
  };
};
