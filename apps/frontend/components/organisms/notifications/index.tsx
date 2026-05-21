"use client";

import AppContainer from "@/components/atoms/app-container";
import { motion } from "framer-motion";

import { useMarkAllAsRead } from "@/hooks/notifications/use-mark-all-as-read";
import { useMarkAsRead } from "@/hooks/notifications/use-mark-as-read";
import { useNotifications } from "@/hooks/notifications/use-notifications";
import { useUnreadCount } from "@/hooks/notifications/use-unread-count";
import { NotificationFilters } from "./parts/notification-filters";
import { NotificationHeader } from "./parts/notification-header";
import { NotificationList } from "./parts/notification-list";
import { NotificationPageHeader } from "./parts/notification-page-header";
import { NotificationSummary } from "./parts/notification-summary";

export const NotificationsView = () => {
  const { data, loading, loadingMore, hasMore, loadMore, setSearch } =
    useNotifications();
  const { unreadCount } = useUnreadCount();
  const { markAsRead } = useMarkAsRead();
  const { markAllAsRead } = useMarkAllAsRead();

  const totalCount = data.meta.total;

  return (
    <AppContainer>
      <NotificationPageHeader unreadCount={unreadCount} />
      <NotificationSummary totalCount={totalCount} unreadCount={unreadCount} />

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
            notifications={data.items}
            loading={loading}
            loadingMore={loadingMore}
            hasMore={hasMore}
            onMarkAsRead={markAsRead}
            onLoadMore={loadMore}
          />
        </div>
      </motion.div>
    </AppContainer>
  );
};
