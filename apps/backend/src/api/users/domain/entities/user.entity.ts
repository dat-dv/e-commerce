export enum Gender {
  MALE = 0,
  FEMALE = 1,
  OTHER = 2,
}

enum AddressLabel {
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
  label?: AddressLabel | null;
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
  phone: string;
  phone_code?: string | null;
  is_verified: boolean;
  is_default: boolean;
  user_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface IUser {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  email: string;
  date_of_birth?: Date | null;
  gender?: Gender | null;
  avatar_id?: string | null;
  password?: string;
  salt?: string | null;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
  role_id?: string | null;
  role_name?: string | null;
  addresses?: IAddress[];
  phones?: IUserPhone[];
}
