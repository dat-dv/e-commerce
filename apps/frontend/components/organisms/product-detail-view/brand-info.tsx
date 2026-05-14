"use client";

export const BrandInfo = () => {
  return (
    <div className="bg-surface border border-content/[0.05] rounded-2xl p-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-content/[0.05] flex items-center justify-center text-lg font-bold text-content/40">
          Logo
        </div>
        <div>
          <h3 className="font-bold text-content">Official Brand</h3>
          <p className="text-xs text-content/50">
            Authentic products from this brand
          </p>
        </div>
      </div>
    </div>
  );
};
