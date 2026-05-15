export enum EGender {
  MALE = 0,
  FEMALE = 1,
  OTHER = 2,
}

export enum EAddressLabel {
  HOME = 0,
  OFFICE = 1,
  APARTMENT = 2,
  OTHER = 3,
}

export interface IAddress {
  id: string;
  receiver_name: string;
  receiver_phone: string;
  country_code?: string | null;
  label?: EAddressLabel | null;
  map_address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  street?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postal_code?: string | null;
  is_default: boolean;
  user_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface IUserPhone {
  id: string;
  phone_number: string;
  phone_code?: string | null;
  is_verified: boolean;
  is_default: boolean;
  user_id: string;
  created_at: Date;
  updated_at: Date;
}
