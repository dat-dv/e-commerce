import type { IApiResponse, IAttributeListResponse } from "@ecommerce/shared";

export interface IAdminAttributeRepository {
  getAttributes(): Promise<IApiResponse<IAttributeListResponse>>;
}
