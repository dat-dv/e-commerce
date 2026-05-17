"use client";

import AppContainer from "@/components/atoms/app-container";
import { motion } from "framer-motion";

import { useNotifications } from "@/hooks/notifications/use-notifications";
import { NotificationFilters } from "./parts/notification-filters";
import { NotificationHeader } from "./parts/notification-header";
import { NotificationList } from "./parts/notification-list";
import { NotificationPageHeader } from "./parts/notification-page-header";
import { NotificationSummary } from "./parts/notification-summary";
import { useLoadOnce } from "@/hooks/use-load-once";

export const NotificationsView = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    loading,
    loadingMore,
    hasMore,
    loadMore,
    setSearch,
    refresh,
    total,
    canLoad,
  } = useNotifications();

  useLoadOnce(refresh, canLoad);

  const totalCount = total || notifications.length;

  return (
    <>
      <NotificationPageHeader unreadCount={unreadCount} />

      <AppContainer>
        <NotificationSummary
          totalCount={totalCount}
          unreadCount={unreadCount}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-8"
        >
          <NotificationHeader
            unreadCount={unreadCount}
            onMarkAllAsRead={markAllAsRead}
          />

          <div className="grid grid-cols-1 gap-8">
            <NotificationFilters onSearch={setSearch} />

            <NotificationList
              notifications={notifications}
              loading={loading}
              loadingMore={loadingMore}
              hasMore={hasMore}
              onMarkAsRead={markAsRead}
              onLoadMore={loadMore}
            />
          </div>
        </motion.div>
      </AppContainer>
    </>
  );
};
