"use client";

interface NotificationSummaryProps {
  totalCount: number;
  unreadCount: number;
}

const NotificationSummaryCard = ({
  label,
  value,
}: {
  label: string;
  value: number;
}) => (
  <div className="rounded-2xl border border-content/[0.06] bg-content/[0.02] p-4">
    <p className="text-xs font-black uppercase tracking-[0.18em] text-content/35">
      {label}
    </p>
    <p className="mt-2 text-2xl font-black text-content">{value}</p>
  </div>
);

export const NotificationSummary = ({
  totalCount,
  unreadCount,
}: NotificationSummaryProps) => {
  const readCount = Math.max(totalCount - unreadCount, 0);

  return (
    <div className="mb-8 grid grid-cols-1 gap-3 md:grid-cols-3">
      <NotificationSummaryCard label="Total Updates" value={totalCount} />
      <NotificationSummaryCard label="Unread" value={unreadCount} />
      <NotificationSummaryCard label="Read" value={readCount} />
    </div>
  );
};
