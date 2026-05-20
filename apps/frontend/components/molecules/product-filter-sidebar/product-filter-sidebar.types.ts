import { TCategory } from "@/domain/categories/types/categories.model";

export interface IProductFilterSidebarProps<T extends string = string> {
  categories: TCategory[];
  onFilterChange: (filters: { key: T; value: string | null }[]) => void;
  onCategoryChange: (slug: string) => void;
  hideCategories?: boolean;
  searchPlaceholder?: string;
  initialSearchValue?: string;
  onSearchSubmit?: (value: string) => void;
  minPriceValue?: string;
  maxPriceValue?: string;
  ratingValue?: string;
  activeSlug?: string;
}

export interface IProductPriceFilterProps<T extends string = string> {
  minPriceValue: string | "";
  maxPriceValue: string | "";
  onFilterChange?: (filters: { key: T; value: string | null }[]) => void;
}

export interface IProductRatingFilterProps {
  handleRatingClick: (rating: number) => void;
  ratingValue: string;
}

export interface IProductSearchFilterProps {
  show: boolean;
  onSearchSubmit?: (value: string) => void;
  searchPlaceholder?: string;
  initialSearchValue: string;
}

export interface ICategoryFilterSectionProps {
  categories: TCategory[];
  activeSlug?: string;
  onCategoryChange: (slug: string) => void;
}
