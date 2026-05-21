import AppContainer from "@/components/atoms/app-container";
import { TProduct } from "@/domain/products/types/products.model";
import { IPaginationMeta } from "@/utils/request/request.types";
import DiscoveryCarouselSection from "../discovery-sections";
import NewArrivalList from "./new-arrival-list";
import { FreshArrivalsHeader } from "./new-arrivale-header";

interface NewArrivalViewProps {
  products: TProduct[];
  meta: IPaginationMeta;
}

const NewArrivalView = ({ products, meta }: NewArrivalViewProps) => {
  return (
    <AppContainer className="space-y-2 sm:space-y-4">
      <FreshArrivalsHeader />
      <NewArrivalList products={products} meta={meta} />
      <DiscoveryCarouselSection />
    </AppContainer>
  );
};

export default NewArrivalView;
