import { TCategory } from "@/domain/categories/types/categories.model";

export interface ICategoryNavSidebarProps {
  categories: TCategory[];
  activeId: string;
  setActiveId: (id: string) => void;
}
