"use client";

import React, { useState } from "react";
import { Bell, Check, Clock, Package, Info, Zap, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "@/hooks/notifications/use-notifications";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/utils/cn";
import { INotificationResponse } from "@ecommerce/shared";
import Link from "next/link";

export const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading } =
    useNotifications();

  const getIcon = (type: string) => {
    switch (type) {
      case "ORDER":
        return <Package size={14} className="text-blue-500" />;
      case "PROMO":
        return <Zap size={14} className="text-orange-500" />;
      default:
        return <Info size={14} className="text-gray-500" />;
    }
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-content/[0.05] transition-colors"
      >
        <Bell
          size={20}
          className={cn("text-content/60", isOpen && "text-primary")}
        />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-background">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popover */}
      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-transparent"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-80 md:w-96 bg-surface/90 backdrop-blur-xl border border-content/[0.05] rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-content/[0.05] flex items-center justify-between">
                <h3 className="font-bold text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                {loading ? (
                  <div className="p-8 text-center text-xs text-content/40 uppercase tracking-widest">
                    Loading updates...
                  </div>
                ) : notifications.length > 0 ? (
                  <div className="divide-y divide-content/[0.03]">
                    {notifications.map((notif) => (
                      <NotificationItem
                        key={notif.id}
                        notif={notif}
                        onRead={() => markAsRead(notif.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-content/[0.02] flex items-center justify-center text-content/10">
                      <Bell size={24} />
                    </div>
                    <p className="text-xs text-content/40 font-medium">
                      All caught up!
                    </p>
                  </div>
                )}
              </div>

              <div className="p-3 border-t border-content/[0.05] bg-content/[0.01]">
                <Link
                  href="/notifications"
                  className="block text-center text-[10px] font-bold text-content/40 hover:text-content transition-colors uppercase tracking-[0.2em]"
                >
                  View all notifications
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const NotificationItem = ({
  notif,
  onRead,
}: {
  notif: INotificationResponse;
  onRead: () => void;
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case "ORDER":
        return <Package size={14} className="text-blue-500" />;
      case "PROMO":
        return <Zap size={14} className="text-orange-500" />;
      default:
        return <Info size={14} className="text-gray-500" />;
    }
  };

  return (
    <div
      className={cn(
        "p-4 flex gap-4 transition-colors relative group cursor-pointer hover:bg-content/[0.02]",
        !notif.is_read && "bg-primary/[0.02]",
      )}
      onClick={() => !notif.is_read && onRead()}
    >
      <div
        className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-content/[0.05]",
          notif.is_read
            ? "bg-content/[0.02]"
            : "bg-primary/10 border-primary/20",
        )}
      >
        {getIcon(notif.type)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h4
            className={cn(
              "text-xs font-bold text-content",
              !notif.is_read && "text-primary",
            )}
          >
            {notif.title}
          </h4>
          <span className="text-[9px] text-content/30 flex items-center gap-1">
            <Clock size={8} />
            {formatDistanceToNow(new Date(notif.created_at), {
              addSuffix: true,
            })}
          </span>
        </div>
        <p className="mt-1 text-[11px] text-content/60 line-clamp-2 leading-relaxed">
          {notif.content}
        </p>
      </div>

      {!notif.is_read && (
        <div className="absolute top-4 right-4 w-1.5 h-1.5 bg-primary rounded-full" />
      )}
    </div>
  );
};
