import { TBrand } from "@/domain/homepage/types/homepage.model";
import AppContainer from "@/components/atoms/app-container";
import TopBrandsHeader from "@/components/organisms/top-brands-grid/top-brands-header";
import TopBrandsGrid from "./top-brands-list";

interface TopBrandsViewProps {
  brands: TBrand[];
}

const TopBrandsView = ({ brands }: TopBrandsViewProps) => {
  return (
    <AppContainer>
      <TopBrandsHeader />
      <TopBrandsGrid brands={brands} />
    </AppContainer>
  );
};

export default TopBrandsView;
