import { useState, useEffect, useCallback, useRef } from "react";
import { notificationsUseCase } from "@/domain/notifications/use-cases";
import { useAuthStore } from "../auth/use-auth-store";
import { useNotificationStore } from "@/store/notification-store";

export const useNotifications = () => {
  const {
    notifications,
    loading,
    hasLoaded,
    setNotifications,
    setLoading,
    markAsRead: storeMarkAsRead,
    markAllAsRead: storeMarkAllAsRead,
  } = useNotificationStore();

  const isFetching = useRef(false);

  const [searchQuery, setSearchQuery] = useState("");
  const user = useAuthStore((s) => s.user);

  const fetchNotifications = useCallback(
    async (force = false) => {
      if (!user) return;
      if (isFetching.current) return;
      if (hasLoaded && !force) return;

      isFetching.current = true;
      setLoading(true);
      try {
        const response = await notificationsUseCase.getNotifications();
        if (response.data) {
          setNotifications(response.data);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
        isFetching.current = false;
      }
    },
    [user, hasLoaded, setLoading, setNotifications],
  );

  const markAsRead = async (id: string) => {
    try {
      storeMarkAsRead(id); // Optimistic update
      await notificationsUseCase.markAsRead(id);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      storeMarkAllAsRead(); // Optimistic update
      await notificationsUseCase.markAllAsRead();
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (!searchQuery) return true;
    const lowerQuery = searchQuery.toLowerCase();
    return (
      n.title.toLowerCase().includes(lowerQuery) ||
      n.content.toLowerCase().includes(lowerQuery)
    );
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return {
    notifications: filteredNotifications,
    unreadCount,
    loading,
    refresh: () => fetchNotifications(true),
    markAsRead,
    markAllAsRead,
    setSearch: setSearchQuery,
  };
};
