"use client";

import { notificationsUseCase } from "@/domain/notifications/use-cases";
import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { createNotificationStore } from "@/store/notification-store";
import { TNotificationStoreState } from "@/store/notification-store/notification-store.type";
import { createContext, ReactNode, useEffect, useRef, useState } from "react";

export type NotificationStore = ReturnType<typeof createNotificationStore>;
export const NotificationContext = createContext<NotificationStore | null>(
  null,
);

export interface NotificationProviderProps {
  children: ReactNode;
  initState?: Partial<TNotificationStoreState>;
}

export const NotificationProvider = ({
  children,
  initState,
}: NotificationProviderProps) => {
  const [store] = useState(() => createNotificationStore(initState));
  const user = useAuthStore((s) => s.user);
  const userId = user?.id;
  const loadedUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!userId) {
      loadedUserId.current = null;
      store.getState().reset();
      return;
    }
    if (loadedUserId.current === userId) return;

    const fetchInitialData = async () => {
      try {
        loadedUserId.current = userId;
        const response = await notificationsUseCase.getUnreadCount();
        if (response.status === "success") {
          store.getState().setUnreadCount(response.data.count);
        }
      } catch (e) {
        console.error("Failed to fetch initial unread count", e);
      }
    };

    fetchInitialData();
  }, [userId, store]);

  return (
    <NotificationContext.Provider value={store}>
      {children}
    </NotificationContext.Provider>
  );
};
