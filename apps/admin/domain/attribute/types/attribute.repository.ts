import type { IApiResponse } from "@ecommerce/shared";

import type { IAdminAttribute } from "@/domain/product";

export interface IAdminAttributeRepository {
  getAttributes(): Promise<IApiResponse<IAdminAttribute[]>>;
}
