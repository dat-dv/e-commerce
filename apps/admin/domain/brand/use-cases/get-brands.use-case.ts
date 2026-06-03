import type { IApiResponse, IGetBrandListRequest } from "@ecommerce/shared";

import type { IAdminBrand } from "@/domain/product";
import type { ApiListResponse } from "@/utils/request";
import { UseCase } from "@/utils/use-case";

import type { IAdminBrandRepository } from "../types/brand.repository";

export class GetBrandsUseCase extends UseCase<
  IGetBrandListRequest | undefined,
  Promise<IApiResponse<ApiListResponse<IAdminBrand>>>
> {
  constructor(private repository: IAdminBrandRepository) {
    super();
  }

  async execute(
    request?: IGetBrandListRequest,
  ): Promise<IApiResponse<ApiListResponse<IAdminBrand>>> {
    return this.repository.getBrands(request);
  }
}
