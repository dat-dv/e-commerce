"use client";

import { Bell, BellDot, CheckCheck } from "lucide-react";

interface NotificationSummaryProps {
  totalCount: number;
  unreadCount: number;
}

export const NotificationSummary = ({
  totalCount,
  unreadCount,
}: NotificationSummaryProps) => {
  const readCount = Math.max(totalCount - unreadCount, 0);

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
      <SummaryCard label="Total Notifications" value={totalCount} icon={Bell} />

      <SummaryCard label="Unread" value={unreadCount} icon={BellDot} active />

      <SummaryCard label="Read" value={readCount} icon={CheckCheck} />
    </div>
  );
};

interface SummaryCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  active?: boolean;
}

const SummaryCard = ({
  label,
  value,
  icon: Icon,
  active = false,
}: SummaryCardProps) => {
  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border p-5 transition-all duration-300 ${
        active
          ? "border-primary/15 bg-primary/[0.04]"
          : "border-content/[0.05] bg-surface/50"
      }`}
    >
      {/* Ambient Glow */}
      <div
        className={`absolute right-0 top-0 h-24 w-24 rounded-full blur-3xl transition-opacity ${
          active
            ? "bg-primary/10 opacity-100"
            : "bg-content/[0.03] opacity-0 group-hover:opacity-100"
        }`}
      />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-content/35">
            {label}
          </p>

          <p className="mt-3 text-4xl font-black tracking-tight text-content">
            {value}
          </p>
        </div>

        <div
          className={`flex size-11 items-center justify-center rounded-2xl ${
            active
              ? "bg-primary/10 text-primary"
              : "bg-content/[0.04] text-content/40"
          }`}
        >
          <Icon size={20} strokeWidth={2.2} />
        </div>
      </div>
    </div>
  );
};
