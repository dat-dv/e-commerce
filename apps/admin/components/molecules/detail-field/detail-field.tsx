import React from "react";

export interface IDetailFieldProps {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const DetailField = ({
  label,
  value,
  icon: Icon,
}: IDetailFieldProps) => {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-[var(--border-color)] bg-[var(--app-bg)]/35 p-3">
      <Icon className="text-content/40 mt-0.5 h-4 w-4 shrink-0" />
      <div className="min-w-0">
        <p className="text-content/45 text-xs font-semibold tracking-wide uppercase">
          {label}
        </p>
        <p className="text-content mt-1 text-sm font-medium break-words">
          {value}
        </p>
      </div>
    </div>
  );
};
