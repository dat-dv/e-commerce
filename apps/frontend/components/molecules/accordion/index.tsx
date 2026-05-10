import { ReactNode } from "react";

type AccordionProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

export default function Accordion({
  title,
  children,
  className = "",
}: AccordionProps) {
  return (
    <details
      className={`group border border-content/5 rounded-2xl bg-surface shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      <summary className="p-6 text-base font-bold text-content cursor-pointer list-none flex justify-between items-center select-none">
        <span className="group-hover:text-primary transition-colors">
          {title}
        </span>
        <svg
          className="w-5 h-5 text-content/40 transition-transform duration-300 group-open:rotate-180"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </summary>
      <div className="px-6 pb-6 text-content/60 text-sm animate-in fade-in duration-300 border-t border-content/5 pt-4 mt-2">
        {children}
      </div>
    </details>
  );
}
