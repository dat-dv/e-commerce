import {
  PAGINATION_LIMITS,
  createInitialPaginationMeta,
} from "@/constants/pagination.constant";
import { INotification } from "@/domain/notifications/types/notification";
import { notificationsUseCase } from "@/domain/notifications/use-cases";
import { usePagination } from "@/hooks/use-pagination";
import { useNotificationStore } from "@/store/notification-store";
import { createEmptyPaginatedData } from "@/utils/request/pagination";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuthStore } from "../auth/use-auth-store";

const LIMIT = PAGINATION_LIMITS.NOTIFICATIONS;
const INITIAL_META = createInitialPaginationMeta(LIMIT);

export const useNotifications = () => {
  const storeNotifications = useNotificationStore(
    (state) => state.notifications,
  );
  const setNotifications = useNotificationStore(
    (state) => state.setNotifications,
  );

  const storeMarkAsRead = useNotificationStore((state) => state.markAsRead);
  const storeMarkAllAsRead = useNotificationStore(
    (state) => state.markAllAsRead,
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [readIds, setReadIds] = useState<Set<string>>(() => new Set());
  const [isAllRead, setIsAllRead] = useState(false);
  const [serverUnreadCount, setServerUnreadCount] = useState(0);

  const user = useAuthStore((s) => s.user);

  const fetchNotificationsPage = useCallback(
    async (params: { page: number; limit: number }) => {
      if (!user) {
        return {
          status: "success" as const,
          data: createEmptyPaginatedData<INotification>(params),
        };
      }

      return notificationsUseCase.getNotifications(params);
    },
    [user],
  );

  const { items, meta, hasMore, loading, loadingMore, loadPage, loadMore } =
    usePagination<INotification, { page: number; limit: number }>({
      initialData: {
        items: [],
        meta: INITIAL_META,
      },
      fetchPage: fetchNotificationsPage,
      getItemKey: (item) => item.id,
    });

  useEffect(() => {
    setNotifications(items);
  }, [items, setNotifications]);

  const markAsRead = async (id: string) => {
    try {
      const notification = storeNotifications.find((item) => item.id === id);

      storeMarkAsRead(id);
      setReadIds((prev) => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });
      if (notification && !notification.isRead && !id.startsWith("fcm-")) {
        setServerUnreadCount((count) => Math.max(count - 1, 0));
      }
      if (id.startsWith("fcm-")) return;

      await notificationsUseCase.markAsRead(id);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      storeMarkAllAsRead();
      setIsAllRead(true);
      setServerUnreadCount(0);
      await notificationsUseCase.markAllAsRead();
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const loadUnreadCount = useCallback(async () => {
    if (!user) {
      setServerUnreadCount(0);
      return;
    }

    const response = await notificationsUseCase.getUnreadCount();

    if (response.status === "success") {
      setServerUnreadCount(response.data.count);
    }
  }, [user]);

  const refresh = useCallback(async () => {
    setReadIds(new Set());
    setIsAllRead(false);
    await Promise.all([loadPage(1), loadUnreadCount()]);
  }, [loadPage, loadUnreadCount]);

  const notifications = useMemo(
    () =>
      storeNotifications.map((notification) =>
        isAllRead || readIds.has(notification.id)
          ? { ...notification, isRead: true }
          : notification,
      ),
    [isAllRead, readIds, storeNotifications],
  );

  const filteredNotifications = notifications.filter((notification) => {
    if (!searchQuery) return true;
    const lowerQuery = searchQuery.toLowerCase();
    return (
      notification.title.toLowerCase().includes(lowerQuery) ||
      notification.content.toLowerCase().includes(lowerQuery)
    );
  });

  const loadedUnreadCount = notifications.filter((n) => !n.isRead).length;
  const localTransientUnreadCount = notifications.filter(
    (n) => !n.isRead && n.id.startsWith("fcm-"),
  ).length;
  const unreadCount = isAllRead
    ? 0
    : Math.max(
        serverUnreadCount + localTransientUnreadCount,
        loadedUnreadCount,
      );

  return {
    notifications: filteredNotifications,
    unreadCount,
    loading,
    loadingMore,
    hasMore,
    loadMore,
    refresh,
    markAsRead,
    markAllAsRead,
    setSearch: setSearchQuery,
    total: meta.total,
    canLoad: Boolean(user),
  };
};
