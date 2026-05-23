"use client";

import { notificationsUseCase } from "@/domain/notifications/use-cases";
import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { useFCM } from "@/hooks/notifications/use-fcm";
import { useNotificationStore } from "@/store/notification-store";
import { ReactNode, useEffect } from "react";

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  useFCM();

  const user = useAuthStore((s) => s.user);
  const setNotifications = useNotificationStore((s) => s.setNotifications);
  const setUnreadCount = useNotificationStore((s) => s.setUnreadCount);

  useEffect(() => {
    if (!user) return;
    const getNoti = async () => {
      const [noti, count] = await Promise.all([
        notificationsUseCase.getNotifications({ page: 1, limit: 20 }),
        notificationsUseCase.getUnreadCount(),
      ]);

      setNotifications(noti.data);
      setUnreadCount(count.data.count);
    };

    getNoti();
  }, [setNotifications, setUnreadCount, user]);
  return children;
};
