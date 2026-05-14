import React from "react";

interface DescriptionCategoryProps {
  name: string;
  category?: string;
  description?: string;
}

export const DescriptionCategory = ({
  name,
  category,
  description,
}: DescriptionCategoryProps) => {
  return (
    <div className="bg-surface border border-content/[0.05] rounded-2xl p-8 shadow-sm space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded uppercase tracking-wider border border-primary/10">
            {category || "General"}
          </span>
        </div>
        <h2 className="text-xl font-bold text-content leading-tight">{name}</h2>
      </div>

      <div className="pt-6 border-t border-content/[0.05]">
        <h3 className="text-sm font-bold text-content uppercase tracking-widest mb-4 opacity-50">
          Product Description
        </h3>
        <div
          className="text-content/70 text-sm leading-relaxed space-y-4 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{
            __html:
              description ||
              "This is the detailed description for the product. Data is currently being updated.",
          }}
        />
      </div>
    </div>
  );
};
