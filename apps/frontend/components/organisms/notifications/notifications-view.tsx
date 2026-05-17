"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCheck, Filter, Search } from "lucide-react";
import { useNotifications } from "@/hooks/notifications/use-notifications";
import { NotificationItem } from "@/components/organisms/notifications/notification-item";

export const NotificationsView = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading } =
    useNotifications();

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-8"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-content tracking-tight">
              Notifications
            </h1>
            <p className="text-content/40 text-sm font-medium">
              Manage your orders, updates, and promotional activities.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="group flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95"
              >
                <CheckCheck size={14} />
                Mark all as read
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 gap-6">
          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 group w-full">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-content/30 group-focus-within:text-primary transition-colors pointer-events-none z-10"
              />
              <input
                type="text"
                placeholder="Search notifications..."
                className="w-full h-12 bg-surface border border-content/[0.08] hover:border-content/[0.15] focus:border-content/[0.25] transition-all rounded-full pl-11 pr-24 text-sm outline-none text-content placeholder:text-content/30 font-medium shadow-sm shadow-content/[0.02]"
              />
              <button className="absolute right-1.5 top-1.5 bottom-1.5 px-5 bg-content/[0.06] hover:bg-content/[0.12] text-content rounded-full text-[10px] font-bold transition-all z-10 uppercase tracking-wider">
                Find
              </button>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button className="flex items-center gap-2 h-12 px-6 rounded-full bg-surface border border-content/[0.08] text-[11px] font-bold text-content/60 hover:text-content hover:border-content/[0.2] transition-all shadow-sm shadow-content/[0.02]">
                <Filter size={14} />
                All Types
              </button>
            </div>
          </div>

          {/* List Container */}
          <div className="bg-surface rounded-[2rem] border border-content/[0.05] shadow-xl shadow-content/[0.02] overflow-hidden">
            {loading ? (
              <div className="p-20 text-center space-y-4">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-[10px] font-bold text-content/20 uppercase tracking-widest">
                  Fetching your updates...
                </p>
              </div>
            ) : notifications.length > 0 ? (
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
                      onRead={markAsRead}
                      className="p-6 hover:bg-primary/[0.01]"
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-24 text-center flex flex-col items-center gap-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-content">
                    No notifications yet
                  </h3>
                  <p className="text-sm text-content/40 max-w-[280px] mx-auto leading-relaxed">
                    We&apos;ll let you know when something important happens
                    with your account or orders.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Pagination Placeholder */}
          {notifications.length > 0 && (
            <div className="flex justify-center pt-4">
              <button className="text-[10px] font-bold text-content/30 hover:text-primary transition-colors uppercase tracking-[0.2em] py-2 px-8 rounded-full border border-content/[0.05] hover:border-primary/20">
                Load more activity
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
