import React from "react";

export interface IFeatureItem {
  name: string;
  desc: string;
  icon: React.ComponentType<{
    size?: number;
    className?: string;
    strokeWidth?: number;
  }>;
  color?: string;
  href?: string;
  badge?: string;
}

export interface IFeatureGridProps {
  items: IFeatureItem[];
  classNames?: string;
  linkComponent?: React.ElementType;
}
