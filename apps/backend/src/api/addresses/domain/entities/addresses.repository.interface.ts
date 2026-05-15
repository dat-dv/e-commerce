import { ShippingAddress, ICreateAddressInput, IUpdateAddressInput } from '@ecommerce/shared';

export interface IAddressesRepository {
  create(userId: string, data: ICreateAddressInput): Promise<ShippingAddress>;
  findAll(userId: string): Promise<ShippingAddress[]>;
  findById(id: string): Promise<ShippingAddress | null>;
  update(id: string, data: IUpdateAddressInput): Promise<ShippingAddress>;
  delete(id: string): Promise<void>;
  unsetOthersDefault(userId: string, excludeId: string): Promise<void>;
}

export const IAddressesRepository = Symbol('IAddressesRepository');
