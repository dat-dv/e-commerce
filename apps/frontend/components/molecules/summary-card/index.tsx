interface SummaryCardProps {
  label: string;
  /**
   * The value displayed inside the card.
   * Can be a number (e.g. item counts) or a pre-formatted string (e.g. localized currency).
   */
  value: string | number;
  icon: React.ElementType;
  active?: boolean;
}

/**
 * SummaryCard renders an elegant key performance indicator or status block.
 * It is separated from specific business domains to serve as a general-purpose
 * atomic presentation molecule for dashboard metrics, counts, and financial summaries.
 */
const SummaryCard = ({
  label,
  value,
  icon: Icon,
  active = false,
}: SummaryCardProps) => {
  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border p-5 transition-all duration-300 ${
        active
          ? "border-primary/15 bg-primary/[0.04]"
          : "border-content/[0.05] bg-surface/50"
      }`}
    >
      {/* Ambient Glow */}
      <div
        className={`absolute right-0 top-0 h-24 w-24 rounded-full blur-3xl transition-opacity ${
          active
            ? "bg-primary/10 opacity-100"
            : "bg-content/[0.03] opacity-0 group-hover:opacity-100"
        }`}
      />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-content/35">
            {label}
          </p>

          <p className="mt-3 text-4xl font-black tracking-tight text-content">
            {value}
          </p>
        </div>

        <div
          className={`flex size-11 items-center justify-center rounded-2xl ${
            active
              ? "bg-primary/10 text-primary"
              : "bg-content/[0.04] text-content/40"
          }`}
        >
          <Icon size={20} strokeWidth={2.2} />
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
