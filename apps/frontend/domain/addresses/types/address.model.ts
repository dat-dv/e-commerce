import { EAddressLabel } from "@ecommerce/shared";

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
  receiver_name: string;
  receiver_phone: string;
  label: EAddressLabel;
  street: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  latitude: number;
  longitude: number;
  is_default: boolean;
}
