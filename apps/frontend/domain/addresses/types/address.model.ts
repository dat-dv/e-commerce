import type { EAddressLabel } from "@ecommerce/shared";

export interface TAddress {
  id: string;
  name: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  street: string;
  country: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  label: EAddressLabel;
  isDefault: boolean;
}

export interface TCreateAddressInput {
  receiverName: string;
  receiverPhone: string;
  label: EAddressLabel;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
}
