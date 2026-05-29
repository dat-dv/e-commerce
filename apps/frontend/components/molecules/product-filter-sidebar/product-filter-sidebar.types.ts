import { TCategory } from "@/domain/categories/types/categories.model";

export interface IProductFilterSidebarProps<T extends string = string> {
  categories: TCategory[];
  onFilterChange: (filters: { key: T; value: string | null }[]) => void;
  onCategoryChange: (slug: string) => void;
  hideCategories?: boolean;
  minPriceValue?: string;
  maxPriceValue?: string;
  ratingValue?: string;
  activeSlug?: string;
}

export interface ICategoryFilterSectionProps {
  categories: TCategory[];
  activeSlug?: string;
  onCategoryChange: (slug: string) => void;
}
