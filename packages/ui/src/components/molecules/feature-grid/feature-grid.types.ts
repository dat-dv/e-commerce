import { type LucideIcon } from "lucide-react";

export interface IFeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface IFeatureGridProps {
  features: IFeatureItem[];
  className?: string;
}
