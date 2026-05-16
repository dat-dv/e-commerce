"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import { INotification } from "@/domain/notifications/types/notification";
import { NotificationItem } from "../notification-item";

interface NotificationListProps {
  notifications: INotification[];
  loading: boolean;
  onMarkAsRead: (id: string) => void;
}

export const NotificationList = ({
  notifications,
  loading,
  onMarkAsRead,
}: NotificationListProps) => {
  if (loading) {
    return (
      <div className="bg-surface rounded-[2rem] border border-content/[0.08] p-20 text-center space-y-4 shadow-xl shadow-content/[0.02]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-[10px] font-bold text-content/20 uppercase tracking-[0.2em]">
          Fetching your updates...
        </p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="bg-surface rounded-2xl border border-content/[0.08] p-24 text-center flex flex-col items-center gap-6 shadow-xl shadow-content/[0.02]">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-content">
            No notifications yet
          </h3>
          <p className="text-sm text-content/40 max-w-[280px] mx-auto leading-relaxed font-inter">
            We&apos;ll let you know when something important happens with your
            account or orders.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-2xl border border-content/[0.08] shadow-2xl shadow-content/[0.02] overflow-hidden">
      <div className="divide-y divide-content/[0.03]">
        {notifications.map((notif, index) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <NotificationItem
              notif={notif}
              onRead={onMarkAsRead}
              className="p-6 hover:bg-primary/[0.01] transition-all duration-300"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
