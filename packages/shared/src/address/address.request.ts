export interface ICreateAddressInput {
  receiver_name: string;
  receiver_phone: string;
  label: number;
  latitude: number;
  longitude: number;
  street: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  is_default?: boolean;
}

export type IUpdateAddressInput = Partial<ICreateAddressInput>;
