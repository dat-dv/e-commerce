import { TBrand } from "@/domain/homepage/types/homepage.model";
import { BrandCard } from "@/components/molecules/brrand-card";

interface TopBrandsGridProps {
  brands: TBrand[];
}

const TopBrandsGrid = ({ brands }: TopBrandsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[240px]">
      {brands.map((brand, index) => {
        const isLarge = index === 0 || index === 5 || index === 10;
        return (
          <BrandCard
            key={brand.id}
            brand={brand}
            isLarge={isLarge}
            index={index}
          />
        );
      })}
    </div>
  );
};

export default TopBrandsGrid;
