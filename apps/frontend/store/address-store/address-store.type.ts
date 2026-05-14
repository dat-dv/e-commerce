import { TAddress } from "@/domain/addresses/types/address.model";

export interface IAddressStoreState {
  addresses: TAddress[];
  selectedAddressId: string | null;
  loading: boolean;
  _hasHydrated: boolean;
}

export interface IAddressStoreActions {
  setAddresses: (addresses: TAddress[]) => void;
  setSelectedAddressId: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
  setHasHydrated: (state: boolean) => void;
  getSelectedAddress: () => TAddress | undefined;
}

export type IAddressStore = IAddressStoreState & IAddressStoreActions;
