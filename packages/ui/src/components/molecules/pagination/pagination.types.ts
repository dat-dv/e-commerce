import { type ElementType } from "react";

export interface IPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  linkComponent?: ElementType;
  className?: string;
  previousLabel?: string;
  nextLabel?: string;
}
