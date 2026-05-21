import { INotification } from "@/domain/notifications/types/notification";
import { notificationsUseCase } from "@/domain/notifications/use-cases";
import usePagination from "@/hooks/use-pagination";
import { useNotificationStore } from "@/store/notification-store";
import { createEmptyPaginatedData } from "@/utils/request/pagination";
import { ENotificationClientEvent } from "@ecommerce/shared";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuthStore } from "../auth/use-auth-store";
import { useUnreadCount } from "./use-unread-count";

export const useNotifications = () => {
  const storeNotifications = useNotificationStore((s) => s.notifications);
  const setNotifications = useNotificationStore((s) => s.setNotifications);
  const isAllRead = useNotificationStore((s) => s.isAllRead);
  const readIds = useNotificationStore((s) => s.readIds);
  const resetReadStatus = useNotificationStore((s) => s.resetReadStatus);

  const [searchQuery, setSearchQuery] = useState("");
  const user = useAuthStore((s) => s.user);
  const { loadUnreadCount } = useUnreadCount();

  const fetchNotificationsPage = useCallback(
    async (
      params: Partial<{ page: number; limit: number; search: string }>,
    ) => {
      const page = params.page;
      const limit = params.limit;
      if (!user) {
        return {
          status: "success" as const,
          data: createEmptyPaginatedData<INotification>({ page, limit }),
        };
      }
      return notificationsUseCase.getNotifications({ page, limit });
    },
    [user],
  );

  const { data, loading, getData } = usePagination<
    INotification,
    { page: number; limit: number; search: string }
  >({
    isSyncWithSearchParams: false,
    initialData: null,
    fetchPage: fetchNotificationsPage,
  });

  const hasMore = data.meta.page < data.meta.totalPages;
  const loadMore = () => {
    getData({ page: data.meta.page + 1 });
  };

  useEffect(() => {
    setNotifications(data.items);
  }, [data.items, setNotifications]);

  const refresh = useCallback(async () => {
    resetReadStatus();
    await Promise.all([getData({ page: 1 }), loadUnreadCount()]);
  }, [getData, loadUnreadCount, resetReadStatus]);

  useEffect(() => {
    const handleRefresh = () => {
      void refresh();
    };
    window.addEventListener(ENotificationClientEvent.REFRESH, handleRefresh);
    return () => {
      window.removeEventListener(
        ENotificationClientEvent.REFRESH,
        handleRefresh,
      );
    };
  }, [refresh]);

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

  return {
    notifications: filteredNotifications,
    loading,
    loadingMore: loading,
    hasMore,
    loadMore,
    refresh,
    setSearch: setSearchQuery,
    total: data.meta.total,
    canLoad: Boolean(user),
  };
};
