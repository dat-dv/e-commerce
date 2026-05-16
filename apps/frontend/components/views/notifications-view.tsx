"use client";

import React from "react";
import { motion } from "framer-motion";
import { useNotifications } from "@/hooks/notifications/use-notifications";
import { NotificationFilters } from "../organisms/notifications/parts/notification-filters";
import { NotificationHeader } from "../organisms/notifications/parts/notification-header";
import { NotificationList } from "../organisms/notifications/parts/notification-list";

export const NotificationsView = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading } =
    useNotifications();

  return (
    <div className="container max-w-4xl mx-auto py-16 px-4 min-h-[90vh]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-10"
      >
        <NotificationHeader
          unreadCount={unreadCount}
          onMarkAllAsRead={markAllAsRead}
        />

        <div className="grid grid-cols-1 gap-8">
          <NotificationFilters />

          <NotificationList
            notifications={notifications}
            loading={loading}
            onMarkAsRead={markAsRead}
          />

          {notifications.length > 0 && !loading && (
            <div className="flex justify-center pt-4">
              <button className="text-[10px] font-black text-content/30 hover:text-primary transition-all duration-300 uppercase tracking-[0.3em] py-3 px-10 rounded-full border border-content/[0.08] hover:border-primary/20 hover:bg-primary/5 bg-surface/50 shadow-sm active:scale-95">
                Load more activity
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
