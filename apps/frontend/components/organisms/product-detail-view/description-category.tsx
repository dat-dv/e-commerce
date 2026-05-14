"use client";

import React from "react";

interface DescriptionCategoryProps {
  category?: string;
}

export const DescriptionCategory = ({ category }: DescriptionCategoryProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8">
        <div className="bg-surface border border-content/[0.05] rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-content mb-4">
            Product Description
          </h2>
          <div className="text-content/70 text-sm leading-relaxed space-y-4">
            <p>
              This is the detailed description for the product. Data is
              currently being updated. This product provides an excellent
              experience with its modern design and high-quality materials.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Exquisite and luxurious design.</li>
              <li>High-quality finishing.</li>
              <li>12-month official warranty.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="lg:col-span-4">
        <div className="bg-surface border border-content/[0.05] rounded-2xl p-6 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-content mb-4">Category</h2>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-content/[0.03] text-content/70 text-xs font-bold rounded-lg border border-content/[0.05]">
              {category || "Uncategorized"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
