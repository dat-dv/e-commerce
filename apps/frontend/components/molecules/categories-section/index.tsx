"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { Carousel, CarouselItem } from "@/components/molecules/carousel";
import { CategoryCard } from "../category-card";
import { APP_ROUTES } from "@/constants/routes";
import { SectionHeader } from "../section-header";

interface ICategory {
  id: string;
  slug: string;
  name: string;
}

interface CategoriesSectionProps {
  categories?: ICategory[];
  lang?: string;
  onLoadMore?: () => void;
  total?: number;
  current?: number;
}

export const CategoriesSection = ({
  categories = [],
  lang = "vi",
  onLoadMore,
}: CategoriesSectionProps) => {
  const title = lang === "vi" ? "Danh Mục" : "Categories";

  const displayCategories = categories.map((c) => c.name);

  // Group categories into columns of 2 for the 2-row carousel
  const chunkedCategories = [];
  for (let i = 0; i < displayCategories.length; i += 2) {
    chunkedCategories.push(displayCategories.slice(i, i + 2));
  }

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        title={title}
        href={APP_ROUTES.CATEGORIES}
        icon={Sparkles}
        lang={lang}
      />

      <Carousel options={{ align: "start" }} loadMore={onLoadMore}>
        {chunkedCategories.map((column, index) => (
          <CarouselItem
            key={index}
            className="flex-[0_0_50%] md:flex-[0_0_33.33%] lg:flex-[0_0_20%]"
          >
            <div className="flex flex-col gap-4">
              {column.map((name, catIndex) => (
                <CategoryCard
                  key={name}
                  name={name}
                  count="100+ Products"
                  image={`https://picsum.photos/100?random=${index * 2 + catIndex}`}
                />
              ))}
            </div>
          </CarouselItem>
        ))}
      </Carousel>
    </div>
  );
};
