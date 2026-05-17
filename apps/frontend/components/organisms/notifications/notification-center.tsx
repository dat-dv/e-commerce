"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "@/hooks/notifications/use-notifications";
import { cn } from "@/utils/cn";
import Link from "next/link";

import { NotificationItem } from "./notification-item";
import { useLoadOnce } from "@/hooks/use-load-once";

export const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    loading,
    refresh,
    canLoad,
  } = useNotifications();

  useLoadOnce(refresh, canLoad);

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
                    className="text-[11px] font-medium text-primary hover:text-primary/80 transition-colors"
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
                  <div className="">
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

              <div className="p-4 border-t border-content/[0.05] bg-content/[0.01]">
                <Link
                  href="/notifications"
                  className="group flex items-center justify-center gap-2 text-[12px] font-semibold text-content/50 hover:text-primary transition-all duration-300"
                >
                  View all notifications
                  <div className="w-0 group-hover:w-4 overflow-hidden transition-all duration-300">
                    <div className="h-[1px] w-4 bg-primary" />
                  </div>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
