import { TAddress } from "../types/address.model";

export interface IAddressDTO {
  id: string;
  receiver_name: string;
  receiver_phone: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  is_default: boolean;
}

export class AddressMapper {
  static toDomain(dto: IAddressDTO): TAddress {
    return {
      id: dto.id,
      name: dto.receiver_name,
      phone: dto.receiver_phone,
      province: dto.state,
      district: dto.city,
      ward: "",
      street: dto.street,
      isDefault: dto.is_default,
    };
  }
}
