import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { TNotificationStore } from "./notification-store.type";
import { PUBLIC_ENV } from "@/config/public.env.config";

export const useNotificationStore = create<TNotificationStore>()(
  devtools(
    (set) => ({
      notifications: [],
      loading: false,
      hasLoaded: false,

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

      reset: () => set({ notifications: [], loading: false, hasLoaded: false }),
    }),
    {
      name: "NotificationStore",
      enabled: PUBLIC_ENV.IS_DEBUG,
    },
  ),
);
