"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { Carousel, CarouselItem } from "@/components/molecules/carousel";
import { CategoryCard } from "../category-card";
import { APP_ROUTES } from "@/constants/routes";
import { SectionHeader } from "../section-header";
import { useTranslations } from "next-intl";

interface ICategory {
  id: string;
  slug: string;
  name: string;
}

interface CategoriesCarouselProps {
  categories?: ICategory[];
  lang?: string;
  onLoadMore?: () => void;
  total?: number;
  current?: number;
}

export const CategoriesCarousel = ({
  categories = [],
  onLoadMore,
}: CategoriesCarouselProps) => {
  const t = useTranslations("HomePage.sections");
  const title = t("categories");

  const chunkedCategories = [];
  for (let i = 0; i < categories.length; i += 2) {
    chunkedCategories.push(categories.slice(i, i + 2));
  }

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        title={title}
        href={APP_ROUTES.CATEGORIES}
        icon={<Sparkles className="w-5 h-5 text-purple-500" />}
      />

      <Carousel options={{ align: "start" }} loadMore={onLoadMore}>
        {chunkedCategories.map((column, index) => (
          <CarouselItem
            key={index}
            className="flex-[0_0_50%] md:flex-[0_0_33.33%] lg:flex-[0_0_20%]"
          >
            <div className="flex flex-col gap-4">
              {column.map((category, catIndex) => (
                <CategoryCard
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  name={category.name}
                  count={t("categoryProductCount", { count: "100+" })}
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
