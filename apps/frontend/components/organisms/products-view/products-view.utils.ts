import { TCategory } from "@/domain/categories/types/categories.model";

export const findTopLevelCategoryForSlug = (
  categories: TCategory[],
  slug: string,
): TCategory | null => {
  for (const category of categories) {
    if (category.slug === slug) return category;

    if (category.children) {
      const found = findTopLevelCategoryForSlug(category.children, slug);
      if (found) return category;
    }
  }

  return null;
};

export const getActiveCategoryTitle = (
  categories: TCategory[],
  slug: string,
): string | null => {
  for (const category of categories) {
    if (category.slug === slug) return category.name;

    if (category.children) {
      const found = getActiveCategoryTitle(category.children, slug);
      if (found) return found;
    }
  }

  return null;
};
