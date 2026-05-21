import { notificationsUseCase } from "@/domain/notifications/use-cases";
import { useNotificationStore } from "@/store/notification-store";
import { useCallback } from "react";
import { useAuthStore } from "../auth/use-auth-store";

export const useUnreadCount = () => {
  const user = useAuthStore((s) => s.user);

  const serverUnreadCount = useNotificationStore((s) => s.unreadCount);
  const setServerUnreadCount = useNotificationStore((s) => s.setUnreadCount);

  const notifications = useNotificationStore((s) => s.notifications);
  const isAllRead = useNotificationStore((s) => s.isAllRead);
  const readIds = useNotificationStore((s) => s.readIds);

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

  const computedNotifications = notifications.map((notification) =>
    isAllRead || readIds.has(notification.id)
      ? { ...notification, isRead: true }
      : notification,
  );

  const loadedUnreadCount = computedNotifications.filter(
    (n) => !n.isRead,
  ).length;
  const localTransientUnreadCount = computedNotifications.filter(
    (n) => !n.isRead && n.id.startsWith("fcm-"),
  ).length;

  const unreadCount = isAllRead
    ? 0
    : Math.max(
        serverUnreadCount + localTransientUnreadCount,
        loadedUnreadCount,
      );

  return {
    unreadCount,
    loadUnreadCount,
  };
};
