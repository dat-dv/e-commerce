"use client";

export const AddressLoadingCard = () => {
  return (
    <div className="rounded-2xl border border-content/[0.05] bg-surface/40 p-5">
      <div className="animate-pulse space-y-3">
        <div className="h-4 w-1/3 rounded bg-content/[0.06]" />
        <div className="h-3 w-2/3 rounded bg-content/[0.05]" />
        <div className="h-3 w-1/2 rounded bg-content/[0.05]" />
      </div>
    </div>
  );
};

export default AddressLoadingCard;
