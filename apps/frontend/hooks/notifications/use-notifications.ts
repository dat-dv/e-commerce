import { notificationsUseCase } from "@/domain/notifications/use-cases";
import { useNotificationStore } from "@/store/notification-store";
import { ENotificationClientEvent } from "@ecommerce/shared";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useUnreadCount } from "./use-unread-count";

export const useNotifications = () => {
  const storeNotifications = useNotificationStore((s) => s.data);
  const appendNotifications = useNotificationStore(
    (s) => s.appendNotifications,
  );
  const setNotifications = useNotificationStore((s) => s.setNotifications);

  const isAllRead = useNotificationStore((s) => s.isAllRead);
  const readIds = useNotificationStore((s) => s.readIds);
  const resetReadStatus = useNotificationStore((s) => s.resetReadStatus);
  const loading = false;
  const [searchQuery, setSearchQuery] = useState("");
  const { loadUnreadCount } = useUnreadCount();

  const getData = useCallback(async () => {
    const page = 1;
    const limit = storeNotifications.meta.limit;
    const response = await notificationsUseCase.getNotifications({
      page,
      limit,
    });
    if (response.data?.items.length > 0) {
      appendNotifications(response.data);
    }
  }, [storeNotifications, appendNotifications]);

  const loadMore = useCallback(async () => {
    const page = storeNotifications.meta.page + 1;
    const limit = storeNotifications.meta.limit;
    if (page > storeNotifications.meta.totalPages) {
      return;
    }

    const response = await notificationsUseCase.getNotifications({
      page,
      limit,
    });
    if (response.data?.items.length > 0) {
      setNotifications(response.data);
    }
  }, [storeNotifications, setNotifications]);

  const refresh = useCallback(async () => {
    resetReadStatus();
    await Promise.all([getData(), loadUnreadCount()]);
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
      storeNotifications?.items?.map((notification) =>
        isAllRead || readIds.has(notification.id)
          ? { ...notification, isRead: true }
          : notification,
      ) || [],
    [isAllRead, readIds, storeNotifications],
  );

  const filteredNotifications = notifications?.filter((notification) => {
    if (!searchQuery) return true;
    const lowerQuery = searchQuery.toLowerCase();
    return (
      notification.title.toLowerCase().includes(lowerQuery) ||
      notification.content.toLowerCase().includes(lowerQuery)
    );
  });

  const data = {
    meta: {
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1,
    },
    items: filteredNotifications,
  };

  const hasMore =
    storeNotifications.items?.length < storeNotifications.meta.total;

  return {
    data: storeNotifications,
    loading,
    loadingMore: loading,
    hasMore,
    loadMore,
    refresh,
    setSearch: setSearchQuery,
    total: data.meta.total,
  };
};
