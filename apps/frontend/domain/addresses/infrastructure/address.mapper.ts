import { TAddress, TCreateAddressInput } from "../types/address.model";

export interface IAddressDTO {
  id: string;
  receiver_name: string;
  receiver_phone: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  latitude: number;
  longitude: number;
  label: number;
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
      country: dto.country,
      postalCode: dto.postal_code,
      latitude: dto.latitude,
      longitude: dto.longitude,
      label: dto.label,
      isDefault: dto.is_default,
    };
  }

  static toCreateDTO(input: TCreateAddressInput): Omit<IAddressDTO, "id"> {
    return {
      receiver_name: input.receiverName,
      receiver_phone: input.receiverPhone,
      street: input.street,
      city: input.city,
      state: input.state,
      country: input.country,
      postal_code: input.postalCode,
      latitude: input.latitude,
      longitude: input.longitude,
      label: input.label,
      is_default: input.isDefault,
    };
  }

  static toUpdateDTO(
    input: Partial<TCreateAddressInput>,
  ): Partial<IAddressDTO> {
    const dto: Partial<IAddressDTO> = {};
    if (input.receiverName) dto.receiver_name = input.receiverName;
    if (input.receiverPhone) dto.receiver_phone = input.receiverPhone;
    if (input.street) dto.street = input.street;
    if (input.city) dto.city = input.city;
    if (input.state) dto.state = input.state;
    if (input.country) dto.country = input.country;
    if (input.postalCode) dto.postal_code = input.postalCode;
    if (input.latitude) dto.latitude = input.latitude;
    if (input.longitude) dto.longitude = input.longitude;
    if (input.label !== undefined) dto.label = input.label;
    if (input.isDefault !== undefined) dto.is_default = input.isDefault;
    return dto;
  }
}
