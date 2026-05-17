"use client";

import AppContainer from "@/components/atoms/app-container";
import { motion } from "framer-motion";

import { useNotifications } from "@/hooks/notifications/use-notifications";
import { NotificationFilters } from "./parts/notification-filters";
import { NotificationHeader } from "./parts/notification-header";
import { NotificationList } from "./parts/notification-list";
import { NotificationLoadMore } from "./parts/notification-load-more";
import { NotificationPageHeader } from "./parts/notification-page-header";
import { NotificationSummary } from "./parts/notification-summary";

export const NotificationsView = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    loading,
    setSearch,
  } = useNotifications();

  const totalCount = notifications.length;

  return (
    <>
      <NotificationPageHeader unreadCount={unreadCount} />

      <AppContainer size="lg" className="min-h-[70vh] pb-16">
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
              onMarkAsRead={markAsRead}
            />

            <NotificationLoadMore show={notifications.length > 0 && !loading} />
          </div>
        </motion.div>
      </AppContainer>
    </>
  );
};
