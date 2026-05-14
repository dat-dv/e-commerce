import { IAddress } from "../types/address.model";

export interface IAddressDTO {
  id: string;
  name: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  street: string;
  is_default: boolean;
}

export class AddressMapper {
  static toDomain(dto: IAddressDTO): IAddress {
    return {
      id: dto.id,
      name: dto.name,
      phone: dto.phone,
      province: dto.province,
      district: dto.district,
      ward: dto.ward,
      street: dto.street,
      isDefault: dto.is_default,
    };
  }
}
