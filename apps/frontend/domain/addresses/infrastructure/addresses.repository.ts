import { API_ROUTES } from "@/constants/routes";
import { ApiResponse, TRequest } from "@/utils/request/request.types";
import { TAddress, TCreateAddressInput } from "../types/address.model";
import { AddressMapper, IAddressDTO } from "./address.mapper";

export interface IAddressesRepository {
  getAddresses(): Promise<ApiResponse<TAddress[]>>;
  getDefaultAddress(): Promise<ApiResponse<TAddress>>;
  createAddress(data: TCreateAddressInput): Promise<ApiResponse<TAddress>>;
  updateAddress(
    id: string,
    data: Partial<TCreateAddressInput>,
  ): Promise<ApiResponse<TAddress>>;
  deleteAddress(id: string): Promise<ApiResponse<void>>;
  setDefaultAddress(id: string): Promise<ApiResponse<TAddress>>;
}

export class AddressesRepository implements IAddressesRepository {
  constructor(private request: TRequest) {}

  async getAddresses(): Promise<ApiResponse<TAddress[]>> {
    const response = await this.request.get<IAddressDTO[]>(
      API_ROUTES.ADDRESSES.MINE,
    );
    return {
      ...response,
      data: response.data?.map(AddressMapper.toDomain) || [],
    } as ApiResponse<TAddress[]>;
  }

  async getDefaultAddress(): Promise<ApiResponse<TAddress>> {
    const response = await this.request.get<IAddressDTO>(
      API_ROUTES.ADDRESSES.DEFAULT,
    );
    return {
      ...response,
      data: response.data ? AddressMapper.toDomain(response.data) : undefined,
    } as ApiResponse<TAddress>;
  }

  async createAddress(
    data: TCreateAddressInput,
  ): Promise<ApiResponse<TAddress>> {
    const response = await this.request.post<IAddressDTO>(
      API_ROUTES.ADDRESSES.BASE,
      data,
    );
    return {
      ...response,
      data: response.data ? AddressMapper.toDomain(response.data) : undefined,
    } as ApiResponse<TAddress>;
  }

  async updateAddress(
    id: string,
    data: Partial<TCreateAddressInput>,
  ): Promise<ApiResponse<TAddress>> {
    const response = await this.request.patch<IAddressDTO>(
      `${API_ROUTES.ADDRESSES.BASE}/${id}`,
      data,
    );
    return {
      ...response,
      data: response.data ? AddressMapper.toDomain(response.data) : undefined,
    } as ApiResponse<TAddress>;
  }
  async deleteAddress(id: string): Promise<ApiResponse<void>> {
    return this.request.delete<void>(`${API_ROUTES.ADDRESSES.BASE}/${id}`);
  }

  async setDefaultAddress(id: string): Promise<ApiResponse<TAddress>> {
    const response = await this.request.patch<IAddressDTO>(
      `${API_ROUTES.ADDRESSES.BASE}/${id}`,
      { is_default: true },
    );
    return {
      ...response,
      data: response.data ? AddressMapper.toDomain(response.data) : undefined,
    } as ApiResponse<TAddress>;
  }
}
