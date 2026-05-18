"use client";

export const ReviewListSkeleton = () => {
  return (
    <>
      {[...Array(3)].map((_, index) => (
        <div key={index} className="animate-pulse py-4">
          <div className="mb-2 h-4 w-1/4 rounded bg-content/[0.05]" />
          <div className="mb-1 h-3 w-full rounded bg-content/[0.05]" />
          <div className="h-3 w-2/3 rounded bg-content/[0.05]" />
        </div>
      ))}
    </>
  );
};
