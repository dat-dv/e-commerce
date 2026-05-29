import { TCategory } from "@/domain/categories/types/categories.model";

export const categoryHasActiveId = (
  category: TCategory,
  activeId: string,
): boolean => {
  if (category.id === activeId) return true;

  return (
    category.children?.some((child) => categoryHasActiveId(child, activeId)) ??
    false
  );
};

export const filterCategoriesByKeyword = (
  categories: TCategory[],
  keyword: string,
): TCategory[] => {
  const normalizedKeyword = keyword.trim().toLowerCase();
  if (!normalizedKeyword) return categories;

  return categories.reduce<TCategory[]>((result, category) => {
    const matchingChildren = category.children
      ? filterCategoriesByKeyword(category.children, normalizedKeyword)
      : [];
    const matchesSelf =
      category.name.toLowerCase().includes(normalizedKeyword) ||
      category.slug.toLowerCase().includes(normalizedKeyword);

    if (matchesSelf || matchingChildren.length > 0) {
      result.push({
        ...category,
        children: matchesSelf ? category.children : matchingChildren,
      });
    }

    return result;
  }, []);
};

export const getCategoryIds = (items: TCategory[]): string[] => {
  return items.reduce<string[]>((acc, item) => {
    acc.push(item.id);
    if (item.children) {
      acc.push(...getCategoryIds(item.children));
    }
    return acc;
  }, []);
};

export const getActiveBranchIds = (
  categories: TCategory[],
  activeId: string,
) => {
  const activeBranchIds: string[] = [];

  const findActiveBranch = (items: TCategory[]) => {
    for (const item of items) {
      if (categoryHasActiveId(item, activeId)) {
        activeBranchIds.push(item.id);
        if (item.children) {
          findActiveBranch(item.children);
        }
      }
    }
  };

  findActiveBranch(categories);
  return activeBranchIds;
};
