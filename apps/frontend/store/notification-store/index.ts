import { PUBLIC_ENV } from "@/config/public.env.config";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { TNotificationStore } from "./notification-store.type";

export const useNotificationStore = create<TNotificationStore>()(
  devtools(
    (set) => ({
      notifications: [],
      loading: false,
      hasLoaded: false,
      unreadCount: 0,
      readIds: new Set(),
      isAllRead: false,

      setNotifications: (notifications) =>
        set({
          notifications,
          hasLoaded: true,
          loading: false,
        }),
      setLoading: (loading) => set({ loading }),

      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n,
          ),
        })),

      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({
            ...n,
            isRead: true,
          })),
        })),

      addNotification: (notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications],
        })),

      setUnreadCount: (unreadCount) => set({ unreadCount }),
      addReadId: (id) =>
        set((state) => {
          const next = new Set(state.readIds);
          next.add(id);
          return { readIds: next };
        }),
      setIsAllRead: (isAllRead) => set({ isAllRead }),
      resetReadStatus: () => set({ readIds: new Set(), isAllRead: false }),

      reset: () =>
        set({
          notifications: [],
          loading: false,
          hasLoaded: false,
          unreadCount: 0,
          readIds: new Set(),
          isAllRead: false,
        }),
    }),
    {
      name: "NotificationStore",
      enabled: PUBLIC_ENV.IS_DEBUG,
    },
  ),
);
