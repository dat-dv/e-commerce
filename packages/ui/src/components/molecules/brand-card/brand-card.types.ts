import { type ElementType } from "react";

export interface IBrandCardProps {
  name: string;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  productCount?: number;
  description?: string | null;
  href: string;
  linkComponent?: ElementType;
  imageComponent?: ElementType;
  productCountLabel?: string | ((count: number) => string);
  viewArchiveLabel?: string;
  className?: string;
}
