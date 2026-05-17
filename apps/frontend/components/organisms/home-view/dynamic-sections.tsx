"use client";

import React from "react";
import {
  Zap,
  Sparkles,
  Laptop,
  Home,
  Heart,
  Eye,
  LucideIcon,
} from "lucide-react";
import { FlashSaleCarousel } from "@/components/molecules/flash-sale-carousel";
import { ProductCarousel } from "@/components/molecules/product-carousel";
import { HOMEPAGE_SECTION_TYPES } from "@/constants/homepage";
import { THomepageSection } from "@/domain/homepage/types/homepage.model";
import { getSectionHref } from "@/utils/homepage";

interface DynamicSectionsProps {
  sections: THomepageSection[];
}

const SECTION_ICONS: Record<string, LucideIcon> = {
  [HOMEPAGE_SECTION_TYPES.FLASH_SALE]: Zap,
  [HOMEPAGE_SECTION_TYPES.RECOMMENDS]: Sparkles,
  [HOMEPAGE_SECTION_TYPES.RECENT_VIEW]: Eye,
  electronics: Laptop,
  "tv-audio-cameras": Laptop,
  "toys-baby-products": Sparkles,
  "beauty-health": Heart,
  "home-kitchen": Home,
  default: Sparkles,
};

const getIcon = (type: string, slug?: string) => {
  if (type === HOMEPAGE_SECTION_TYPES.FLASH_SALE) return Zap;
  if (type === HOMEPAGE_SECTION_TYPES.RECOMMENDS) return Sparkles;
  if (type === HOMEPAGE_SECTION_TYPES.RECENT_VIEW) return Eye;
  return SECTION_ICONS[slug || ""] || SECTION_ICONS.default;
};

export const DynamicSections = ({ sections }: DynamicSectionsProps) => {
  return (
    <>
      {sections.map((sectionItem) => {
        const { type, title, categories, id } = sectionItem.section;
        const slug = categories?.[0]?.slug;
        const isShowFlashSale =
          type === HOMEPAGE_SECTION_TYPES.FLASH_SALE &&
          sectionItem.data.length > 0;

        if (isShowFlashSale) {
          return <FlashSaleCarousel key={id} products={sectionItem.data} />;
        }
        if (sectionItem.data.length > 0) {
          const targetHref = getSectionHref(type, slug);

          return (
            <ProductCarousel
              key={id}
              title={title}
              href={targetHref}
              icon={getIcon(type, slug)}
              products={sectionItem.data}
              rows={1}
            />
          );
        }

        return null;
      })}
    </>
  );
};
