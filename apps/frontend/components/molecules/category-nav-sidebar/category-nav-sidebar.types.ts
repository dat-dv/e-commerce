import { TCategory } from "@/domain/categories/types/categories.model";

export interface ICategoryNavSidebarProps {
  categories: TCategory[];
  activeId: string;
  setActiveId: (id: string) => void;
}

export interface ICategoryTreeItemProps {
  category: TCategory;
  activeId: string;
  level: number;
  forceExpanded: boolean;
  onSelect: (id: string) => void;
}
