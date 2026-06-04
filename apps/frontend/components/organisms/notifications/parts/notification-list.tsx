"use client";

import { EmptyState, VirtualList } from "@ecommerce/ui";
import { TYPOGRAPHY } from "@/constants/typography";
import { INotification } from "@/domain/notifications/types/notification";
import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import { useTranslations } from "next-intl";
import { NotificationItem } from "../notification-item";

interface NotificationListProps {
  notifications: INotification[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  onMarkAsRead: (id: string) => void;
  onLoadMore: () => void;
}

export const NotificationList = ({
  notifications,
  loading,
  loadingMore,
  hasMore,
  onMarkAsRead,
  onLoadMore,
}: NotificationListProps) => {
  const t = useTranslations("NotificationsPage");

  if (loading) {
    return (
      <div className="bg-surface border-content/[0.08] shadow-content/[0.02] space-y-4 rounded-[2rem] border p-20 text-center shadow-xl">
        <div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
        <p
          className={`${TYPOGRAPHY.badge} text-content/20 tracking-[0.2em] uppercase`}
        >
          {t("list.fetchingText")}
        </p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <EmptyState
        title={t("list.emptyTitle")}
        description={t("list.emptyDescription")}
        icon={Bell}
        className="shadow-content/[0.02] shadow-xl"
      />
    );
  }

  return (
    <div className="bg-surface border-content/[0.08] shadow-content/[0.02] overflow-hidden rounded-2xl border shadow-2xl">
      <VirtualList
        data={notifications}
        loadingMore={loadingMore}
        hasMore={hasMore}
        onLoadMore={onLoadMore}
        keyExtractor={(notification) => notification.id}
        className="divide-content/[0.03] divide-y"
        itemClassName=""
        loadingText={t("list.loadingMoreText")}
        endText={t("list.endText")}
        renderItem={(notif, index) => (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: Math.min(index, 8) * 0.04 }}
          >
            <NotificationItem
              notif={notif}
              onRead={onMarkAsRead}
              className="hover:bg-primary/[0.01] p-6 transition-all duration-300"
            />
          </motion.div>
        )}
      />
    </div>
  );
};
