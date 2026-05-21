import AppContainer from "@/components/atoms/app-container";
import { TProduct } from "@/domain/products/types/products.model";
import { PaginatedInitialData } from "@/utils/request/request.types";
import DiscoveryCarouselSection from "../discovery-sections";
import NewArrivalList from "./new-arrival-list";
import { FreshArrivalsHeader } from "./new-arrivale-header";

interface NewArrivalViewProps {
  initialData: PaginatedInitialData<TProduct>;
}

const NewArrivalView = ({ initialData }: NewArrivalViewProps) => {
  return (
    <AppContainer className="space-y-2 sm:space-y-4">
      <FreshArrivalsHeader />
      <NewArrivalList initialData={initialData} />
      <DiscoveryCarouselSection />
    </AppContainer>
  );
};

export default NewArrivalView;
