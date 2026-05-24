"use client";

import Button from "@/components/atoms/button";
import { VirtualList } from "@/components/molecules/virtual-list";
import { TYPOGRAPHY } from "@/constants/typography";
import { useMarkAllAsRead } from "@/hooks/notifications/use-mark-all-as-read";
import { useMarkAsRead } from "@/hooks/notifications/use-mark-as-read";
import { useNotifications } from "@/hooks/notifications/use-notifications";
import { useUnreadCount } from "@/hooks/notifications/use-unread-count";
import { useLoadOnce } from "@/hooks/use-load-once";
import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { Bell } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { VList } from "virtua";

import { NotificationItem } from "./notification-item";

export const NotificationCenter = () => {
  const t = useTranslations("NotificationsPage");
  const [isOpen, setIsOpen] = useState(false);
  const {
    data: notifications,
    loading,
    loadMore,
    hasMore,
    loadingMore,
    refresh,
  } = useNotifications();
  const { unreadCount } = useUnreadCount();
  const { markAsRead } = useMarkAsRead();
  const { markAllAsRead } = useMarkAllAsRead();

  useLoadOnce(refresh, isOpen);

  return (
    <div className="relative">
      {/* Bell Icon */}
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="text-content/60 hover:bg-content/[0.05] hover:text-content relative flex h-10 w-10 items-center justify-center rounded-full p-0 opacity-100 transition-colors hover:opacity-100 active:scale-95"
        title={t("dropdown.title")}
        aria-label={t("dropdown.title")}
      >
        <Bell
          size={24}
          strokeWidth={2.2}
          className={cn("transition-colors", isOpen && "text-primary")}
        />
        {unreadCount > 0 && (
          <span
            className={`border-background absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 bg-red-500 px-1 ${TYPOGRAPHY.badge} leading-none font-black text-white shadow-sm`}
          >
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
              className="bg-surface/90 border-content/[0.05] absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border shadow-2xl backdrop-blur-xl md:w-96"
            >
              <div className="border-content/[0.05] flex items-center justify-between border-b p-4">
                <h3 className={`font-bold ${TYPOGRAPHY.bodySmall}`}>
                  {t("dropdown.title")}
                </h3>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    onClick={markAllAsRead}
                    className={`${TYPOGRAPHY.caption} text-primary hover:text-primary/80 h-auto p-0 font-medium transition-colors hover:bg-transparent active:scale-100`}
                  >
                    {t("dropdown.markAllAsRead")}
                  </Button>
                )}
              </div>

              <div>
                {loading ? (
                  <div
                    className={`p-8 text-center ${TYPOGRAPHY.caption} text-content/40 tracking-widest uppercase`}
                  >
                    {t("dropdown.loadingText")}
                  </div>
                ) : notifications?.items?.length > 0 ? (
                  <div className="h-[350px]">
                    <VirtualList
                      data={notifications?.items ?? []}
                      loadingMore={loadingMore}
                      hasMore={hasMore}
                      onLoadMore={loadMore}
                      WrapperComponent={VList}
                      keyExtractor={(notification) => notification.id}
                      className="divide-content/[0.03] h-full divide-y"
                      itemClassName=""
                      loadingText={t("dropdown.loadingText")}
                      endText={""}
                      renderItem={(notif, index) => (
                        <NotificationItem
                          key={notif.id || index}
                          notif={notif}
                          onRead={() => markAsRead(notif.id)}
                          className="hover:bg-primary/[0.01] transition-all duration-300"
                        />
                      )}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 p-12 text-center">
                    <div className="bg-content/[0.02] text-content/10 flex h-12 w-12 items-center justify-center rounded-full">
                      <Bell size={24} />
                    </div>
                    <p className={`${TYPOGRAPHY.meta} text-content/40`}>
                      {t("dropdown.emptyText")}
                    </p>
                  </div>
                )}
              </div>

              <div className="border-content/[0.05] bg-content/[0.01] border-t p-4">
                <Link
                  href="/notifications"
                  className={`group flex items-center justify-center gap-2 ${TYPOGRAPHY.caption} text-content/50 hover:text-primary font-semibold transition-all duration-300`}
                >
                  {t("dropdown.viewAll")}
                  <div className="w-0 overflow-hidden transition-all duration-300 group-hover:w-4">
                    <div className="bg-primary h-[1px] w-4" />
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
