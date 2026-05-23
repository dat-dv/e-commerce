import { FormCard } from "@/components/atoms/form-card";

const SkeletonLine = ({ className = "" }: { className?: string }) => (
  <div className={`bg-content/5 animate-pulse rounded-full ${className}`} />
);

const SkeletonField = () => (
  <div className="space-y-2">
    <SkeletonLine className="h-3.5 w-24" />
    <SkeletonLine className="h-10 w-full rounded-xl" />
  </div>
);

export function ProfileViewTabletAboveSkeleton() {
  return (
    <FormCard className="space-y-6">
      <div className="border-content/10 flex flex-row items-center gap-4 border-b pb-4">
        <div className="bg-content/5 h-16 w-16 shrink-0 animate-pulse rounded-full" />
        <div className="min-w-0 flex-1 space-y-2">
          <SkeletonLine className="h-5 w-44 max-w-full" />
          <SkeletonLine className="h-3.5 w-64 max-w-full" />
        </div>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonField key={index} />
        ))}
      </div>

      <div className="flex justify-end pt-6">
        <SkeletonLine className="h-11 w-32 rounded-2xl" />
      </div>
    </FormCard>
  );
}
