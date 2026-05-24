import { notificationsUseCase } from "@/domain/notifications/use-cases";
import { useNotificationStore } from "@/store/notification-store";

export const useMarkAllAsRead = () => {
  const storeMarkAllAsRead = useNotificationStore((s) => s.markAllAsRead);

  const markAllAsRead = async () => {
    try {
      const response = await notificationsUseCase.markAllAsRead();
      if (response.status === "success") {
        storeMarkAllAsRead();
      }
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  return {
    markAllAsRead,
  };
};
