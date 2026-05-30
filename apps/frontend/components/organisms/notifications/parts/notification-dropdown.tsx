"use client";

import { Button } from "@ecommerce/ui";
import { TYPOGRAPHY } from "@/constants/typography";
import { useMarkAllAsRead } from "@/hooks/notifications/use-mark-all-as-read";
import { useMarkAsRead } from "@/hooks/notifications/use-mark-as-read";
import { useNotifications } from "@/hooks/notifications/use-notifications";
import { useUnreadCount } from "@/hooks/notifications/use-unread-count";
import { useLoadOnce } from "@ecommerce/ui";
import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { VList } from "virtua";
import { NotificationItem } from "../notification-item";

interface NotificationDropdownProps {
  onClose: () => void;
}

export const NotificationDropdown = ({
  onClose,
}: NotificationDropdownProps) => {
  const t = useTranslations("NotificationsPage");

  const {
    data: notifications,
    loading,
    loadMore,
    loadingMore,
    refresh,
  } = useNotifications();
  const { unreadCount } = useUnreadCount();
  const { markAsRead } = useMarkAsRead();
  const { markAllAsRead } = useMarkAllAsRead();

  useLoadOnce(refresh, notifications?.items?.length === 0);

  return (
    <>
      <div className="fixed inset-0 z-40 bg-transparent" onClick={onClose} />
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
              <VList
                className="divide-content/[0.03] divide-y"
                onScrollEnd={() => {
                  loadMore();
                }}
              >
                {notifications?.items?.map((notif, index) => (
                  <NotificationItem
                    key={notif.id || index}
                    notif={notif}
                    onRead={() => markAsRead(notif.id)}
                    className="hover:bg-primary/[0.01] transition-all duration-300"
                  />
                ))}
                {loadingMore && (
                  <div className="flex flex-col items-center gap-3 py-6">
                    <div className="border-primary/10 border-t-primary h-5 w-5 animate-spin rounded-full border-2" />
                    <span className="text-content/50 text-sm font-medium">
                      {t("dropdown.loadingText")}
                    </span>
                  </div>
                )}
              </VList>
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
  );
};
