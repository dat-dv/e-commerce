import React from "react";
import { Clock, Package, Info, Zap, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import { useLocale } from "next-intl";
import { cn } from "@/utils/cn";
import { INotification } from "@/domain/notifications/types/notification";
import { ENotificationType } from "@ecommerce/shared";

interface NotificationItemProps {
  notif: INotification;
  onRead: (id: string) => void;
  className?: string;
}

export const NotificationItem = ({
  notif,
  onRead,
  className,
}: NotificationItemProps) => {
  const localeKey = useLocale();
  const dateLocale = localeKey === "vi" ? vi : enUS;

  const getIcon = (type: ENotificationType) => {
    switch (type) {
      case ENotificationType.ORDER:
        return <Package size={14} className="text-blue-500" />;
      case ENotificationType.PROMO:
        return <Zap size={14} className="text-orange-500" />;
      case ENotificationType.SOCIAL:
        return <User size={14} className="text-blue-500" />;
      case ENotificationType.SYSTEM:
        return <Info size={14} className="text-gray-500" />;
    }
  };

  return (
    <div
      className={cn(
        "p-4 flex gap-4 transition-all duration-300 relative group cursor-pointer border-b border-content/[0.03] last:border-0",
        !notif.isRead ? "bg-primary/[0.03]" : "hover:bg-content/[0.02]",
        className,
      )}
      onClick={() => !notif.isRead && onRead(notif.id)}
    >
      <div
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300",
          notif.isRead
            ? "bg-content/[0.02] border-content/[0.05]"
            : "bg-primary/10 border-primary/20 shadow-sm shadow-primary/10",
        )}
      >
        {getIcon(notif.type)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <h4
            className={cn(
              "text-[13px] font-semibold text-content/90 transition-colors",
              !notif.isRead && "text-primary",
            )}
          >
            {notif.title}
          </h4>
          <span className="text-[10px] text-content/30 flex items-center gap-1 font-medium">
            <Clock size={10} />
            {formatDistanceToNow(new Date(notif.createdAt), {
              addSuffix: true,
              locale: dateLocale,
            })}
          </span>
        </div>
        <p className="text-[12px] text-content/50 line-clamp-2 leading-relaxed">
          {notif.content}
        </p>
      </div>

      {!notif.isRead && (
        <div className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full ring-4 ring-primary/10 animate-pulse" />
      )}
    </div>
  );
};
