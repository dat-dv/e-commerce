import { UI_RADIUS } from "@/constants/ui-radius";
import { cn } from "@/utils/cn";

interface SummaryCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  active?: boolean;

  className?: string;
  contentClassName?: string;
  labelClassName?: string;
  valueClassName?: string;
  iconWrapperClassName?: string;
  iconClassName?: string;
}

const SummaryCard = ({
  label,
  value,
  icon: Icon,
  active = false,

  className,
  contentClassName,
  labelClassName,
  valueClassName,
  iconWrapperClassName,
  iconClassName,
}: SummaryCardProps) => {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-3xl border p-5 transition-all duration-300",
        active
          ? "border-primary/15 bg-primary/[0.04]"
          : "border-content/[0.05] bg-surface/50",
        className,
      )}
    >
      <div
        className={cn(
          "absolute right-0 top-0 h-24 w-24 rounded-full blur-3xl transition-opacity",
          active
            ? "bg-primary/10 opacity-100"
            : "bg-content/[0.03] opacity-0 group-hover:opacity-100",
        )}
      />

      <div
        className={cn(
          "relative z-10 flex items-start justify-between",
          contentClassName,
        )}
      >
        <div>
          <p
            className={cn(
              "text-xs font-black uppercase tracking-[0.18em] text-content/35",
              labelClassName,
            )}
          >
            {label}
          </p>

          <p
            className={cn(
              "mt-3 text-4xl font-black tracking-tight text-content",
              valueClassName,
            )}
          >
            {value}
          </p>
        </div>

        <div
          className={cn(
            "flex size-11 items-center justify-center",
            UI_RADIUS.panel,
            active
              ? "bg-primary/10 text-primary"
              : "bg-content/[0.04] text-content/40",
            iconWrapperClassName,
          )}
        >
          <Icon className={cn("size-5", iconClassName)} strokeWidth={2.2} />
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
