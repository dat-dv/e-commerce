"use client";

import Button from "@/components/atoms/button";
import { useNotifications } from "@/hooks/notifications/use-notifications";
import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { Bell } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";

import { useLoadOnce } from "@/hooks/use-load-once";
import { NotificationItem } from "./notification-item";

export const NotificationCenter = () => {
  return 1;
  const t = useTranslations("NotificationsPage");
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
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full p-0 text-content/60 transition-colors hover:bg-content/[0.05] hover:text-content active:scale-95 opacity-100 hover:opacity-100"
        title={t("dropdown.title")}
        aria-label={t("dropdown.title")}
      >
        <Bell
          size={24}
          strokeWidth={2.2}
          className={cn("transition-colors", isOpen && "text-primary")}
        />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-background bg-red-500 px-1 text-[10px] font-black leading-none text-white shadow-sm">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </Button>

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
                <h3 className="font-bold text-sm">{t("dropdown.title")}</h3>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    onClick={markAllAsRead}
                    className="text-[11px] font-medium text-primary hover:text-primary/80 transition-colors h-auto p-0 hover:bg-transparent active:scale-100"
                  >
                    {t("dropdown.markAllAsRead")}
                  </Button>
                )}
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                {loading ? (
                  <div className="p-8 text-center text-xs text-content/40 uppercase tracking-widest">
                    {t("dropdown.loadingText")}
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
                      {t("dropdown.emptyText")}
                    </p>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-content/[0.05] bg-content/[0.01]">
                <Link
                  href="/notifications"
                  className="group flex items-center justify-center gap-2 text-[12px] font-semibold text-content/50 hover:text-primary transition-all duration-300"
                >
                  {t("dropdown.viewAll")}
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
