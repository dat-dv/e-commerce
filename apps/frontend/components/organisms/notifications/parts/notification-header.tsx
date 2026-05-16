"use client";

import React from "react";
import { CheckCheck } from "lucide-react";

interface NotificationHeaderProps {
  unreadCount: number;
  onMarkAllAsRead: () => void;
}

export const NotificationHeader = ({
  unreadCount,
  onMarkAllAsRead,
}: NotificationHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-content tracking-tight">
          Notifications
        </h1>
        <p className="text-content/40 text-sm font-medium font-inter">
          Manage your orders, updates, and promotional activities.
        </p>
      </div>

      <div className="flex items-center gap-3">
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllAsRead}
            className="group flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 active:scale-95"
          >
            <CheckCheck size={14} />
            Mark all as read
          </button>
        )}
      </div>
    </div>
  );
};
