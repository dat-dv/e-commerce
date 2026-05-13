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
            Mô tả sản phẩm
          </h2>
          <div className="text-content/70 text-sm leading-relaxed space-y-4">
            <p>
              Đây là phần mô tả chi tiết cho sản phẩm. Hiện tại dữ liệu đang
              được cập nhật. Sản phẩm mang lại trải nghiệm tuyệt vời với thiết
              kế hiện đại và chất liệu cao cấp.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Thiết kế tinh tế, sang trọng.</li>
              <li>Chất lượng hoàn thiện cao cấp.</li>
              <li>Bảo hành chính hãng 12 tháng.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="lg:col-span-4">
        <div className="bg-surface border border-content/[0.05] rounded-2xl p-6 shadow-sm h-fit">
          <h2 className="text-lg font-bold text-content mb-4">Danh mục</h2>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-content/[0.03] text-content/70 text-xs font-bold rounded-lg border border-content/[0.05]">
              {category || "Chưa phân loại"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
