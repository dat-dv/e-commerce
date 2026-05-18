"use client";

import { APP_ROUTES } from "@/constants/routes";
import { TBrand } from "@/domain/homepage/types/homepage.model";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const BrandCard = ({
  brand,
  isLarge,
  index,
}: {
  brand: TBrand;
  isLarge: boolean;
  index: number;
}) => {
  const [imgError, setImgError] = React.useState(false);

  return (
    <div
      className={`group relative transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
        isLarge ? "md:col-span-2 md:row-span-1" : "md:col-span-1"
      }`}
    >
      <Link
        href={APP_ROUTES.BRAND_DETAIL(brand.slug)}
        className="relative flex flex-col h-full rounded-[2rem] overflow-hidden border border-content/[0.06] shadow-sm transition-all duration-500 bg-background group-hover:border-primary/30 group-hover:shadow-2xl group-hover:shadow-primary/10"
      >
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          {brand.bannerUrl ? (
            <div className="relative w-full h-full">
              <Image
                src={brand.bannerUrl}
                alt={brand.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover opacity-[0.15] grayscale group-hover:grayscale-0 group-hover:opacity-30 transition-all duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>
          ) : (
            <div className="w-full h-full bg-content/[0.02]" />
          )}
        </div>

        {/* Content Container */}
        <div className="relative z-10 flex flex-col h-full p-7 justify-between">
          <div className="flex justify-between items-start">
            <div className="w-14 h-14 p-3 rounded-2xl bg-background shadow-2xl flex items-center justify-center border border-content/[0.03] transition-transform duration-300 group-hover:rotate-[-5deg] group-hover:scale-110">
              {brand.logoUrl && !imgError ? (
                <div className="relative w-full h-full">
                  <Image
                    src={brand.logoUrl}
                    alt={brand.name}
                    fill
                    unoptimized
                    sizes="56px"
                    className="object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500"
                    onError={() => setImgError(true)}
                  />
                </div>
              ) : (
                <span className="text-xl font-bold text-primary">
                  {brand.name?.charAt(0)}
                </span>
              )}
            </div>

            <div className="px-3 py-1 rounded-full bg-content/[0.03] border border-content/[0.05] backdrop-blur-md">
              <span className="text-[10px] font-bold text-content/40 uppercase tracking-widest">
                {brand.productCount || 0} Products
              </span>
            </div>
          </div>

          <div className="mt-auto">
            <div className="overflow-hidden">
              <h3
                className={`font-bold text-content leading-tight transition-colors duration-500 group-hover:text-primary ${
                  isLarge ? "text-3xl" : "text-xl"
                }`}
              >
                {brand.name}
              </h3>
            </div>

            {brand.description && (
              <p className="text-[13px] text-content/50 line-clamp-2 mt-2 mb-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                {brand.description}
              </p>
            )}

            <div className="flex items-center gap-2 text-primary font-bold text-[11px] uppercase tracking-[0.2em] mt-4">
              <span>View Archive</span>
              <div className="w-8 h-[1px] bg-primary/30 group-hover:w-12 transition-all duration-500" />
            </div>
          </div>
        </div>

        {/* Glass Reflection Effect */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none" />

        {/* Decorative Shine */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none bg-gradient-to-tr from-primary/10 via-transparent to-transparent transition-opacity duration-500" />
      </Link>
    </div>
  );
};
