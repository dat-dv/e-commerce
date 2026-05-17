import { StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { createStore } from "zustand/vanilla";
import { PUBLIC_ENV } from "@/config/public.env.config";
import { TCategory } from "@/domain/categories/types/categories.model";
import {
  ICategoriesStore,
  ICategoriesStoreState,
} from "./categories-store.type";

const findCategoryPathInTree = (
  categories: TCategory[],
  slug: string,
  path: TCategory[] = [],
): TCategory[] => {
  for (const category of categories) {
    const nextPath = [...path, category];

    if (category.slug === slug) {
      return nextPath;
    }

    if (category.children?.length) {
      const found = findCategoryPathInTree(category.children, slug, nextPath);
      if (found.length) return found;
    }
  }

  return [];
};

const createCategoriesStoreCreator =
  (
    initState?: Partial<ICategoriesStoreState>,
  ): StateCreator<ICategoriesStore> =>
  (set, get, _store) => {
    const state: ICategoriesStore = {
      categories: [],
      loading: false,
      pagination: undefined,
      ...initState,
      setCategories: (categories) => set({ categories }),
      setLoading: (loading) => set({ loading }),
      hydrate: (data) => set((state) => ({ ...state, ...data })),
      findCategoryPath: (slug) =>
        findCategoryPathInTree(get().categories, slug),
      getCategoryNavigationContext: (slug) => {
        const path = get().findCategoryPath(slug);
        const activeCategory = path.at(-1);
        const topCategory = path[0] || activeCategory;
        const siblingCategories =
          path.length > 1
            ? path[path.length - 2]?.children || []
            : topCategory?.children || [];
        const relatedCategories = activeCategory?.children?.length
          ? activeCategory.children
          : siblingCategories;

        return {
          path,
          activeCategory,
          topCategory,
          relatedCategories,
        };
      },
    };

    return state;
  };

export const createCategoriesStore = (
  initState?: Partial<ICategoriesStoreState>,
) =>
  createStore<ICategoriesStore>()(
    devtools(createCategoriesStoreCreator(initState), {
      name: "CategoriesStore",
      enabled: PUBLIC_ENV.IS_DEBUG,
    }),
  );
