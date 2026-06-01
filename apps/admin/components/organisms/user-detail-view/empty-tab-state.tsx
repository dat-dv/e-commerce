import { Package } from "lucide-react";

export const EmptyTabState = ({
  title,
  description,
  icon: Icon = Package,
}: {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
}) => (
  <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border-color)] p-8 text-center">
    <div className="bg-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
      <Icon className="h-5 w-5" />
    </div>
    <h3 className="text-content text-sm font-semibold">{title}</h3>
    <p className="text-content/50 mt-1 max-w-md text-sm">{description}</p>
  </div>
);
