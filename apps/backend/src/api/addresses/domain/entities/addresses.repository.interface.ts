import { IAddressResponse, ICreateAddressInput, IUpdateAddressInput } from '@ecommerce/shared';

export interface IAddressesRepository {
  create(userId: string, data: ICreateAddressInput): Promise<IAddressResponse>;
  findAll(userId: string): Promise<IAddressResponse[]>;
  findById(id: string): Promise<IAddressResponse | null>;
  update(id: string, data: IUpdateAddressInput): Promise<IAddressResponse>;
  delete(id: string): Promise<void>;
  unsetOthersDefault(userId: string, excludeId: string): Promise<void>;
}

export const IAddressesRepository = Symbol('IAddressesRepository');
