import { IAddressResponse } from '@ecommerce/shared';
import { CreateAddressDto } from '../../dto/create-address.dto';
import { UpdateAddressDto } from '../../dto/update-address.dto';

export interface IAddressesRepository {
  create(userId: string, data: CreateAddressDto): Promise<IAddressResponse>;
  findAll(userId: string): Promise<IAddressResponse[]>;
  findById(id: string): Promise<IAddressResponse | null>;
  update(id: string, data: UpdateAddressDto): Promise<IAddressResponse>;
  delete(id: string): Promise<void>;
  unsetOthersDefault(userId: string, excludeId: string): Promise<void>;
}

export const IAddressesRepository = Symbol('IAddressesRepository');
