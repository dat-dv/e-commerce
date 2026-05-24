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
  const isLoaded = useRef(false);

  useEffect(() => {
    if (!user) {
      store.getState().reset();
      return;
    }
    if (isLoaded.current) return;

    const fetchInitialData = async () => {
      try {
        isLoaded.current = true;
        const response = await notificationsUseCase.getUnreadCount();
        if (response.status === "success") {
          store.getState().setUnreadCount(response.data.count);
        }
      } catch (e) {
        console.error("Failed to fetch initial unread count", e);
      }
    };

    fetchInitialData();
  }, [user, store]);

  return (
    <NotificationContext.Provider value={store}>
      {children}
    </NotificationContext.Provider>
  );
};
