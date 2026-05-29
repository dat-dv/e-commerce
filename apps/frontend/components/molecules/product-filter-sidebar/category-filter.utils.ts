import { TCategory } from "@/domain/categories/types/categories.model";

export const categoryHasActiveSlug = (
  category: TCategory,
  activeSlug?: string,
): boolean => {
  if (!activeSlug) return false;
  if (category.slug === activeSlug) return true;

  return (
    category.children?.some((child) =>
      categoryHasActiveSlug(child, activeSlug),
    ) ?? false
  );
};

export const searchCategoryTree = (
  categories: TCategory[],
  keyword: string,
): TCategory[] => {
  const normalizedKeyword = keyword.trim().toLowerCase();

  if (!normalizedKeyword) return categories;

  return categories.reduce<TCategory[]>((result, category) => {
    const matchedChildren = category.children
      ? searchCategoryTree(category.children, normalizedKeyword)
      : [];

    const matchedSelf =
      category.name.toLowerCase().includes(normalizedKeyword) ||
      category.slug.toLowerCase().includes(normalizedKeyword);

    if (!matchedSelf && matchedChildren.length === 0) return result;

    result.push({
      ...category,
      children: matchedSelf ? category.children : matchedChildren,
    });

    return result;
  }, []);
};

export const getCategorySlugs = (items: TCategory[]): string[] => {
  return items.reduce<string[]>((acc, item) => {
    acc.push(item.slug);
    if (item.children) {
      acc.push(...getCategorySlugs(item.children));
    }
    return acc;
  }, []);
};

export const getActiveBranchSlugs = (
  categories: TCategory[],
  activeSlug?: string,
) => {
  const activeBranchSlugs: string[] = [];
  if (!activeSlug) return activeBranchSlugs;

  const findActiveBranch = (items: TCategory[]) => {
    for (const item of items) {
      if (categoryHasActiveSlug(item, activeSlug)) {
        activeBranchSlugs.push(item.slug);
        if (item.children) {
          findActiveBranch(item.children);
        }
      }
    }
  };

  findActiveBranch(categories);
  return activeBranchSlugs;
};
