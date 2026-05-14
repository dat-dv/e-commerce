import { AddressLabel } from "@ecommerce/shared";

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
  label: AddressLabel;
  isDefault: boolean;
}

export interface TCreateAddressInput {
  receiver_name: string;
  receiver_phone: string;
  label: AddressLabel;
  street: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  latitude: number;
  longitude: number;
  is_default: boolean;
}
