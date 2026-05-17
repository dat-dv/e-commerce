import { TAddress } from "@/domain/addresses/types/address.model";

export interface IAddressStoreState {
  addresses: TAddress[];
  selectedAddressId: string | null;
  loading: boolean;
  hasHydrated: boolean;
}

export interface IAddressStoreActions {
  setAddresses: (addresses: TAddress[]) => void;
  setSelectedAddressId: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
  setHasHydrated: (state: boolean) => void;
  getSelectedAddress: () => TAddress | undefined;
  resetStore: () => void;
}

export type IAddressStore = IAddressStoreState & IAddressStoreActions;
