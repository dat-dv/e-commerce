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

export function ProfileViewMobileSkeleton() {
  return (
    <div className="min-w-0 space-y-4">
      <FormCard className="flex flex-col items-center gap-3 py-6">
        <div className="bg-content/5 h-16 w-16 animate-pulse rounded-full" />
        <SkeletonLine className="h-5 w-36" />
        <SkeletonLine className="h-3.5 w-48 max-w-[80%]" />
      </FormCard>

      <FormCard className="space-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonField key={index} />
        ))}
        <div className="mt-4">
          <SkeletonLine className="h-11 w-full rounded-2xl" />
        </div>
      </FormCard>
    </div>
  );
}
