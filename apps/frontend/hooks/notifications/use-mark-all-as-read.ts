import { notificationsUseCase } from "@/domain/notifications/use-cases";
import { useNotificationStore } from "@/store/notification-store";

export const useMarkAllAsRead = () => {
  const storeMarkAllAsRead = useNotificationStore((s) => s.markAllAsRead);
  const setIsAllRead = useNotificationStore((s) => s.setIsAllRead);
  const setServerUnreadCount = useNotificationStore((s) => s.setUnreadCount);

  const markAllAsRead = async () => {
    try {
      storeMarkAllAsRead();
      setIsAllRead(true);
      setServerUnreadCount(0);
      await notificationsUseCase.markAllAsRead();
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  return {
    markAllAsRead,
  };
};
