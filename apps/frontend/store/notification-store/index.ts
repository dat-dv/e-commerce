import { PUBLIC_ENV } from "@/config/public.env.config";
import { INotification } from "@/domain/notifications/types/notification";
import { ApiListResponse } from "@/utils/request/request.types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { TNotificationStore } from "./notification-store.type";

export const useNotificationStore = create<TNotificationStore>()(
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
      readIds: new Set(),
      isAllRead: false,

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
          unreadCount: Math.max(state.unreadCount - 1, 0),
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
          unreadCount: 0,
          isAllRead: true,
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

      addNotification: (data: ApiListResponse<INotification>) =>
        set((state) => ({
          data: {
            ...state.data,
            items: [...data.items, ...state.data.items],
            meta: {
              ...state.data.meta,
              total: state.data.meta.total + data.items.length,
            },
          },
          unreadCount: state.unreadCount + data.items.length,
        })),

      appendNotifications: (data: ApiListResponse<INotification>) =>
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
