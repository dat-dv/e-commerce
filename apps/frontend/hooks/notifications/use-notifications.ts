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
    if (meta.page === 1) {
      setNotifications(items);
    }
  }, [items, meta.page, setNotifications]);

  const markAsRead = async (id: string) => {
    try {
      storeMarkAsRead(id);
      setReadIds((prev) => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });
      await notificationsUseCase.markAsRead(id);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      storeMarkAllAsRead();
      setIsAllRead(true);
      await notificationsUseCase.markAllAsRead();
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const refresh = useCallback(async () => {
    setReadIds(new Set());
    setIsAllRead(false);
    await loadPage(1);
  }, [loadPage]);

  const notifications = useMemo(
    () =>
      items.map((notification) =>
        isAllRead || readIds.has(notification.id)
          ? { ...notification, isRead: true }
          : notification,
      ),
    [isAllRead, items, readIds],
  );

  const filteredNotifications = notifications.filter((notification) => {
    if (!searchQuery) return true;
    const lowerQuery = searchQuery.toLowerCase();
    return (
      notification.title.toLowerCase().includes(lowerQuery) ||
      notification.content.toLowerCase().includes(lowerQuery)
    );
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

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
