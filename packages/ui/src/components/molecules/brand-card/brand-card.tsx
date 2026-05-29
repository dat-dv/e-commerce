"use client";

import React, { useState } from "react";

import { TYPOGRAPHY, UI_RADIUS } from "../../../tokens";
import { cn } from "../../../utils";
import { IBrandCardProps } from "./brand-card.types";

export const BrandCard = ({
  name,
  logoUrl,
  bannerUrl,
  productCount = 0,
  description,
  href,
  linkComponent: LinkComponent = "a",
  imageComponent: ImageComponent = "img",
  productCountLabel = (count: number) => `${count} Products`,
  viewArchiveLabel = "View Archive",
  className,
}: IBrandCardProps) => {
  const [imgError, setImgError] = useState(false);

  const countText =
    typeof productCountLabel === "function"
      ? productCountLabel(productCount)
      : productCountLabel;

  return (
    <div
      className={cn(
        "group relative h-full min-w-0 transition-transform duration-300 hover:-translate-y-1 active:translate-y-0",
        className,
      )}
    >
      <LinkComponent
        href={href}
        className={cn(
          UI_RADIUS.card,
          "border-content/[0.08] bg-background group-hover:border-primary/35 group-hover:shadow-primary/10 relative flex h-full min-h-[220px] flex-col overflow-hidden border shadow-sm transition-all duration-300 group-hover:shadow-lg",
        )}
      >
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          {bannerUrl ? (
            <div className="relative h-full w-full">
              <ImageComponent
                src={bannerUrl}
                alt={name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover opacity-[0.15] grayscale transition-all duration-1000 group-hover:scale-110 group-hover:opacity-30 group-hover:grayscale-0"
              />
              <div className="from-background via-background/95 to-background/70 absolute inset-0 bg-gradient-to-br" />
              <div className="from-background via-background/45 absolute inset-0 bg-gradient-to-t to-transparent" />
            </div>
          ) : (
            <div className="bg-content/[0.02] h-full w-full" />
          )}
        </div>

        {/* Content Container */}
        <div className="relative z-10 flex h-full min-w-0 flex-col justify-between gap-6 p-5">
          <div className="flex min-w-0 items-start justify-between gap-3">
            <div
              className={cn(
                UI_RADIUS.media,
                "border-content/[0.06] bg-background flex h-14 w-14 shrink-0 items-center justify-center border p-3 shadow-sm transition-transform duration-300 group-hover:rotate-[-3deg]",
              )}
            >
              {logoUrl && !imgError ? (
                <div className="relative h-full w-full">
                  <ImageComponent
                    src={logoUrl}
                    alt={name}
                    fill
                    unoptimized
                    sizes="56px"
                    className="object-contain grayscale filter transition-all duration-500 group-hover:grayscale-0"
                    onError={() => setImgError(true)}
                  />
                </div>
              ) : (
                <span className="text-primary text-xl font-bold">
                  {name?.charAt(0)}
                </span>
              )}
            </div>

            <div
              className={cn(
                UI_RADIUS.badge,
                "border-content/[0.06] bg-content/[0.03] max-w-[8rem] min-w-0 border px-2.5 py-1",
              )}
            >
              <span
                className={`block truncate ${TYPOGRAPHY.badge} text-content/45 tracking-wide uppercase`}
              >
                {countText}
              </span>
            </div>
          </div>

          <div className="min-w-0">
            <div className="min-w-0">
              <h3 className="text-content group-hover:text-primary line-clamp-2 text-xl leading-tight font-bold transition-colors duration-300">
                {name}
              </h3>
            </div>

            {description && (
              <p className="text-content/55 mt-2 line-clamp-2 min-h-[2.5rem] text-sm leading-5">
                {description}
              </p>
            )}

            <div
              className={`mt-5 flex min-w-0 items-center gap-2 ${TYPOGRAPHY.caption} text-primary font-bold tracking-wide uppercase`}
            >
              <span className="truncate">{viewArchiveLabel}</span>
              <div className="bg-primary/30 h-px w-8 shrink-0 transition-all duration-300 group-hover:w-10" />
            </div>
          </div>
        </div>

        {/* Glass Reflection Effect */}
        <div className="pointer-events-none absolute top-0 left-0 h-1/2 w-full bg-gradient-to-b from-white/[0.05] to-transparent" />

        {/* Decorative Shine */}
        <div className="from-primary/10 pointer-events-none absolute inset-0 bg-gradient-to-tr via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </LinkComponent>
    </div>
  );
};

BrandCard.displayName = "BrandCard";
