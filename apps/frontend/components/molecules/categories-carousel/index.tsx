"use client";

import { CATEGORY_CAROUSEL_ITEM_CLASS } from "@/constants/carousel";
import { APP_ROUTES } from "@/constants/routes";
import {
  Carousel,
  CarouselItem,
  CategoryCard,
  SectionHeader,
} from "@ecommerce/ui";
import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

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
    <section className="flex flex-col gap-4 sm:gap-6">
      <SectionHeader
        title={title}
        href={APP_ROUTES.CATEGORIES}
        icon={<Sparkles className="text-primary size-4 shrink-0 sm:size-5" />}
        linkComponent={Link}
      />

      <Carousel options={{ align: "start" }} loadMore={onLoadMore}>
        {chunkedCategories.map((column, index) => (
          <CarouselItem key={index} className={CATEGORY_CAROUSEL_ITEM_CLASS}>
            <div className="flex flex-col gap-3 sm:gap-4">
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
    </section>
  );
};
