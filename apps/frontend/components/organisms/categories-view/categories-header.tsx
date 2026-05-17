"use client";

import AnimatedPageHeader from "@/components/molecules/page-header-animation";
import { Grid2X2, Tags, Boxes, Sparkles } from "lucide-react";

interface CategoryHeaderProps {
  title: string;
  description: string;
}

export const CategoryHeader = ({ title, description }: CategoryHeaderProps) => {
  return (
    <AnimatedPageHeader
      title={title}
      description={description}
      icons={[Grid2X2, Tags, Boxes, Sparkles]}
    />
  );
};

export default CategoryHeader;
