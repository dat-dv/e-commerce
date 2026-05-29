import { type LucideIcon } from "lucide-react";
import { type ElementType } from "react";

export interface ICategoryCardProps {
  name: string;
  count: string;
  href?: string;
  icon?: LucideIcon;
  color?: string;
  image?: string;
  showCount?: boolean;
  linkComponent?: ElementType;
  imageComponent?: ElementType;
  className?: string;
}
