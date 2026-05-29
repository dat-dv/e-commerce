"use client";

export const ReviewListSkeleton = () => {
  return (
    <>
      {[...Array(3)].map((_, index) => (
        <div key={index} className="animate-pulse py-4">
          <div className="bg-content/[0.05] mb-2 h-4 w-1/4 rounded" />
          <div className="bg-content/[0.05] mb-1 h-3 w-full rounded" />
          <div className="bg-content/[0.05] h-3 w-2/3 rounded" />
        </div>
      ))}
    </>
  );
};
