"use client";

import { VirtualList } from "@/components/molecules/virtual-list";
import { TYPOGRAPHY } from "@/constants/typography";
import { INotification } from "@/domain/notifications/types/notification";
import { motion } from "framer-motion";
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
      <div className="bg-surface rounded-[2rem] border border-content/[0.08] p-20 text-center space-y-4 shadow-xl shadow-content/[0.02]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p
          className={`${TYPOGRAPHY.badge} text-content/20 uppercase tracking-[0.2em]`}
        >
          {t("list.fetchingText")}
        </p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="bg-surface rounded-2xl border border-content/[0.08] p-24 text-center flex flex-col items-center gap-6 shadow-xl shadow-content/[0.02]">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-content">
            {t("list.emptyTitle")}
          </h3>
          <p className="text-sm text-content/40 max-w-[280px] mx-auto leading-relaxed font-inter">
            {t("list.emptyDescription")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-2xl border border-content/[0.08] shadow-2xl shadow-content/[0.02] overflow-hidden">
      <VirtualList
        data={notifications}
        loadingMore={loadingMore}
        hasMore={hasMore}
        onLoadMore={onLoadMore}
        keyExtractor={(notification) => notification.id}
        className="divide-y divide-content/[0.03]"
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
              className="p-6 hover:bg-primary/[0.01] transition-all duration-300"
            />
          </motion.div>
        )}
      />
    </div>
  );
};
