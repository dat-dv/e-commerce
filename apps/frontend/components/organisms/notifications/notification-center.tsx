"use client";

import Button from "@/components/atoms/button";
import { TYPOGRAPHY } from "@/constants/typography";
import { cn } from "@/utils/cn";
import { useUnreadCount } from "@/hooks/notifications/use-unread-count";
import { AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { NotificationDropdown } from "./parts/notification-dropdown";

export const NotificationCenter = () => {
  const t = useTranslations("NotificationsPage");
  const [isOpen, setIsOpen] = useState(false);
  const { unreadCount } = useUnreadCount();

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
        {isOpen && <NotificationDropdown onClose={() => setIsOpen(false)} />}
      </AnimatePresence>
    </div>
  );
};
