export interface IListingProductsToolbarProps {
  total: number;
  currentPage: number;
  totalPages: number;
  isLoading?: boolean;
  sortValue: string;
  onPageChange?: (page: number) => void;
  onSortChange?: (sort: string) => void;
}
