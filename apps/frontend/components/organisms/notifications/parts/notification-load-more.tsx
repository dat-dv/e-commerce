"use client";

interface NotificationLoadMoreProps {
  show: boolean;
}

export const NotificationLoadMore = ({ show }: NotificationLoadMoreProps) => {
  if (!show) {
    return null;
  }

  return (
    <div className="flex justify-center pt-4">
      <button className="text-[10px] font-black uppercase tracking-[0.3em] text-content/30 transition-all duration-300 rounded-full border border-content/[0.08] bg-surface/50 px-10 py-3 shadow-sm hover:border-primary/20 hover:bg-primary/5 hover:text-primary active:scale-95">
        Load more activity
      </button>
    </div>
  );
};
