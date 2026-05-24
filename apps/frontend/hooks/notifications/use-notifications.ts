import { notificationsUseCase } from "@/domain/notifications/use-cases";
import { useNotificationStore } from "@/store/notification-store";
import { useCallback, useMemo, useState } from "react";

export const useNotifications = () => {
  const storeNotifications = useNotificationStore((s) => s.data);
  const appendNotifications = useNotificationStore(
    (s) => s.appendNotifications,
  );
  const setNotifications = useNotificationStore((s) => s.setNotifications);

  const loading = false;
  const [searchQuery, setSearchQuery] = useState("");

  const getData = useCallback(async () => {
    const page = 1;
    const limit = storeNotifications.meta.limit;
    const response = await notificationsUseCase.getNotifications({
      page,
      limit,
    });
    if (response.status === "success") {
      setNotifications(response.data);
    }
  }, [storeNotifications.meta.limit, setNotifications]);

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
    if (response.status === "success") {
      appendNotifications(response.data);
    }
  }, [storeNotifications, appendNotifications]);

  const refresh = useCallback(async () => {
    await getData();
  }, [getData]);

  const notifications = useMemo(
    () => storeNotifications?.items || [],
    [storeNotifications],
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
