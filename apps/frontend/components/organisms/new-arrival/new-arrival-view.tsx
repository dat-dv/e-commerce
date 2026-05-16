import { FreshArrivalsHeader } from "./new-arrivale-header";
import AppContainer from "@/components/atoms/app-container";
import NewArrivalList from "./new-arrival-list";

const NewArrivalView = () => {
  return (
    <AppContainer>
      <FreshArrivalsHeader />
      <NewArrivalList />
    </AppContainer>
  );
};

export default NewArrivalView;
