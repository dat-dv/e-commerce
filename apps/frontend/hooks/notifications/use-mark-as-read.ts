import { notificationsUseCase } from "@/domain/notifications/use-cases";
import { useNotificationStore } from "@/store/notification-store";

export const useMarkAsRead = () => {
  const storeNotifications = useNotificationStore((s) => s.notifications);
  const storeMarkAsRead = useNotificationStore((s) => s.markAsRead);
  const addReadId = useNotificationStore((s) => s.addReadId);
  const serverUnreadCount = useNotificationStore((s) => s.unreadCount);
  const setServerUnreadCount = useNotificationStore((s) => s.setUnreadCount);

  const markAsRead = async (id: string) => {
    try {
      const notification = storeNotifications.find((item) => item.id === id);

      storeMarkAsRead(id);
      addReadId(id);

      if (notification && !notification.isRead && !id.startsWith("fcm-")) {
        setServerUnreadCount(Math.max(serverUnreadCount - 1, 0));
      }
      if (id.startsWith("fcm-")) return;

      await notificationsUseCase.markAsRead(id);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return {
    markAsRead,
  };
};
