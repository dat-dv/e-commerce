import { notificationsUseCase } from "@/domain/notifications/use-cases";
import { useNotificationStore } from "@/store/notification-store";
import { useCallback } from "react";
import { useAuthStore } from "../auth/use-auth-store";

export const useUnreadCount = () => {
  const user = useAuthStore((s) => s.user);

  const serverUnreadCount = useNotificationStore((s) => s.unreadCount);
  const setServerUnreadCount = useNotificationStore((s) => s.setUnreadCount);

  const loadUnreadCount = useCallback(async () => {
    if (!user) {
      setServerUnreadCount(0);
      return;
    }
    const response = await notificationsUseCase.getUnreadCount();
    if (response.status === "success") {
      setServerUnreadCount(response.data.count);
    }
  }, [user, setServerUnreadCount]);

  return {
    unreadCount: serverUnreadCount,
    loadUnreadCount,
  };
};
