export interface IAddress {
  id: string;
  name: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  street: string;
  isDefault: boolean;
}

export interface ICreateAddressInput {
  receiver_name: string;
  receiver_phone: string;
  label: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  latitude: number;
  longitude: number;
  is_default: boolean;
}
