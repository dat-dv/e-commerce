import { FreshArrivalsHeader } from "./new-arrivale-header";
import AppContainer from "@/components/atoms/app-container";
import NewArrivalList from "./new-arrival-list";
import { TProduct } from "@/domain/products/types/products.model";
import { IPaginationMeta } from "@/utils/request/request.types";
import DiscoveryCarouselSection from "../discovery-sections";

interface NewArrivalViewProps {
  products: TProduct[];
  meta: IPaginationMeta;
}

const NewArrivalView = ({ products, meta }: NewArrivalViewProps) => {
  return (
    <AppContainer>
      <FreshArrivalsHeader />
      <NewArrivalList products={products} meta={meta} />
      <DiscoveryCarouselSection />
    </AppContainer>
  );
};

export default NewArrivalView;
