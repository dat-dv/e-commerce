import { TYPOGRAPHY } from "@/constants/typography";
import { INotification } from "@/domain/notifications/types/notification";
import { cn } from "@/utils/cn";
import { ENotificationType } from "@ecommerce/shared";
import { formatDistanceToNow } from "date-fns";
import { enUS, vi } from "date-fns/locale";
import { Clock, Info, Package, User, Zap } from "lucide-react";
import { useLocale } from "next-intl";

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
        "group border-content/[0.03] relative flex cursor-pointer gap-4 border-b p-4 transition-all duration-300 last:border-0",
        !notif.isRead ? "bg-primary/[0.03]" : "hover:bg-content/[0.02]",
        className,
      )}
      onClick={() => !notif.isRead && onRead(notif.id)}
    >
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all duration-300",
          notif.isRead
            ? "bg-content/[0.02] border-content/[0.05]"
            : "bg-primary/10 border-primary/20 shadow-primary/10 shadow-sm",
        )}
      >
        {getIcon(notif.type)}
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-start justify-between">
          <h4
            className={cn(
              `${TYPOGRAPHY.caption} text-content/90 font-semibold transition-colors`,
              !notif.isRead && "text-primary",
            )}
          >
            {notif.title}
          </h4>
          <span
            className={`${TYPOGRAPHY.badge} text-content/30 flex items-center gap-1 font-medium`}
          >
            <Clock size={10} />
            {formatDistanceToNow(new Date(notif.createdAt), {
              addSuffix: true,
              locale: dateLocale,
            })}
          </span>
        </div>
        <p
          className={`${TYPOGRAPHY.caption} text-content/50 line-clamp-2 leading-relaxed`}
        >
          {notif.content}
        </p>
      </div>

      {!notif.isRead && (
        <div className="bg-primary ring-primary/10 absolute top-4 right-4 h-2 w-2 animate-pulse rounded-full ring-4" />
      )}
    </div>
  );
};
