import { PUBLIC_ENV } from "@/config/public.env.config";
import { devtools } from "zustand/middleware";
import { createStore } from "zustand/vanilla";
import {
  TNotificationStore,
  TNotificationStoreState,
} from "./notification-store.type";

export const createNotificationStore = (
  initState?: Partial<TNotificationStoreState>,
) => {
  return createStore<TNotificationStore>()(
    devtools(
      (set) => ({
        data: {
          items: [],
          meta: {
            page: 1,
            limit: 20,
            total: 0,
            totalPages: 0,
          },
        },
        loading: false,
        hasLoaded: false,
        unreadCount: 0,
        ...initState,

        setNotifications: (data) =>
          set({
            data,
            hasLoaded: true,
            loading: false,
          }),
        setLoading: (loading) => set({ loading }),

        markAsRead: (id) =>
          set((state) => ({
            data: {
              ...state.data,
              items: state.data.items.map((n) =>
                n.id === id ? { ...n, isRead: true } : n,
              ),
            },
          })),

        markAllAsRead: () =>
          set((state) => ({
            data: {
              ...state.data,
              items: state.data.items.map((n) => ({
                ...n,
                isRead: true,
              })),
            },
          })),

        setUnreadCount: (unreadCount) => set({ unreadCount }),

        appendNotifications: (data) =>
          set((state) => ({
            data: {
              items: [...state.data.items, ...data.items],
              meta: data.meta,
            },
            hasLoaded: true,
            loading: false,
          })),

        reset: () =>
          set({
            data: {
              items: [],
              meta: {
                page: 1,
                limit: 20,
                total: 0,
                totalPages: 0,
              },
            },
            loading: false,
            hasLoaded: false,
            unreadCount: 0,
          }),
      }),
      {
        name: "NotificationStore",
        enabled: PUBLIC_ENV.IS_DEBUG,
      },
    ),
  );
};

import { NotificationContext } from "@/components/molecules/providers/notification-provider";
import { useContext } from "react";
import { useStore } from "zustand";

export const useNotificationStore = <T>(
  selector: (state: TNotificationStore) => T,
): T => {
  const store = useContext(NotificationContext);
  if (!store) {
    throw new Error("Missing NotificationProvider");
  }

  return useStore(store, selector);
};
