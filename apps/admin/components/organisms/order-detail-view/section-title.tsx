import { type ComponentType } from "react";

interface ISectionTitleProps {
  icon: ComponentType<{ className?: string }>;
  title: string;
}

export const SectionTitle = ({ icon: Icon, title }: ISectionTitleProps) => (
  <div className="mb-3 flex items-center gap-2">
    <Icon className="text-primary h-4 w-4" />
    <h2 className="text-sm font-semibold text-[var(--app-text)]">{title}</h2>
  </div>
);
