import { ShippingAddress } from 'generated/prisma/client';

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

export interface IAddressesRepository {
  create(userId: string, data: ICreateAddressInput): Promise<ShippingAddress>;
  findAll(userId: string): Promise<ShippingAddress[]>;
  findById(id: string): Promise<ShippingAddress | null>;
  update(id: string, data: IUpdateAddressInput): Promise<ShippingAddress>;
  delete(id: string): Promise<void>;
  unsetOthersDefault(userId: string, excludeId: string): Promise<void>;
}

export const IAddressesRepository = Symbol('IAddressesRepository');
