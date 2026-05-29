"use client";

import { AnimatedPageHeader, AppContainer } from "@ecommerce/ui";
import { Grid2X2, Tags, Boxes, Sparkles } from "lucide-react";

interface CategoryHeaderProps {
  title: string;
  description: string;
}

export const CategoryHeader = ({ title, description }: CategoryHeaderProps) => {
  return (
    <AppContainer>
      <AnimatedPageHeader
        title={title}
        description={description}
        icons={[Grid2X2, Tags, Boxes, Sparkles]}
      />
    </AppContainer>
  );
};

export default CategoryHeader;
