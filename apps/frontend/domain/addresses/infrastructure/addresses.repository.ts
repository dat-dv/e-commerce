import { API_ROUTES } from "@/constants/routes";
import { ApiResponse, TRequest } from "@/utils/request/request.types";
import { IAddress, ICreateAddressInput } from "../types/address.model";
import { AddressMapper, IAddressDTO } from "./address.mapper";

export interface IAddressesRepository {
  getAddresses(): Promise<ApiResponse<IAddress[]>>;
  getDefaultAddress(): Promise<ApiResponse<IAddress>>;
  createAddress(data: ICreateAddressInput): Promise<ApiResponse<IAddress>>;
}

export class AddressesRepository implements IAddressesRepository {
  constructor(private request: TRequest) {}

  async getAddresses(): Promise<ApiResponse<IAddress[]>> {
    const response = await this.request.get<IAddressDTO[]>(
      API_ROUTES.ADDRESSES.MINE,
    );
    return {
      ...response,
      data: response.data?.map(AddressMapper.toDomain) || [],
    } as ApiResponse<IAddress[]>;
  }

  async getDefaultAddress(): Promise<ApiResponse<IAddress>> {
    const response = await this.request.get<IAddressDTO>(
      API_ROUTES.ADDRESSES.DEFAULT,
    );
    return {
      ...response,
      data: response.data ? AddressMapper.toDomain(response.data) : undefined,
    } as ApiResponse<IAddress>;
  }

  async createAddress(
    data: ICreateAddressInput,
  ): Promise<ApiResponse<IAddress>> {
    const response = await this.request.post<IAddressDTO>(
      API_ROUTES.ADDRESSES.BASE,
      data,
    );
    return {
      ...response,
      data: response.data ? AddressMapper.toDomain(response.data) : undefined,
    } as ApiResponse<IAddress>;
  }
}
